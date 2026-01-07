package com.estime.notification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.SoftAssertions.assertSoftly;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.estime.outbox.OutboxProcessingOrchestrator;
import com.estime.outbox.OutboxStatus;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.notification.PlatformNotificationOutboxHandler;
import com.estime.room.platform.PlatformType;
import com.estime.room.platform.notification.PlatformNotificationOutbox;
import com.estime.room.platform.notification.PlatformNotificationOutboxRepository;
import com.estime.room.platform.notification.PlatformNotificationType;
import com.estime.support.IntegrationTest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

class PlatformNotificationOutboxHandlerTest extends IntegrationTest {

    private static final Instant NOW = Instant.now().truncatedTo(ChronoUnit.HOURS).plus(365, ChronoUnit.DAYS);
    private static final String CHANNEL_ID = "test-channel";

    @Autowired
    private OutboxProcessingOrchestrator orchestrator;

    @Autowired
    private PlatformNotificationOutboxHandler handler;

    @Autowired
    private PlatformNotificationOutboxRepository repository;

    @Autowired
    private NotificationOutboxJpaRepository jpaRepository;

    @Autowired
    private RoomRepository roomRepository;

    /**
     * 테스트용 Room 생성 헬퍼
     */
    private Room createRoom() {
        final Room room = Room.withoutId(
                "테스트방",
                RoomSession.from(UUID.randomUUID().toString()),
                LocalDateTime.now().plusDays(7)
        );
        return roomRepository.save(room);
    }

    /**
     * 테스트용 PlatformNotificationOutbox 생성 헬퍼
     */
    private PlatformNotificationOutbox createOutbox(
            final Long roomId,
            final Instant scheduledAt
    ) {
        return PlatformNotificationOutbox.of(
                roomId,
                PlatformType.DISCORD,
                CHANNEL_ID,
                PlatformNotificationType.CREATION,
                scheduledAt,
                scheduledAt.plus(1, ChronoUnit.DAYS),
                scheduledAt
        );
    }

    /**
     * 특정 retryCount를 가진 outbox 생성 헬퍼
     */
    private PlatformNotificationOutbox createOutboxWithRetryCount(
            final Long roomId,
            final int targetRetryCount,
            final Instant scheduledAt
    ) {
        final PlatformNotificationOutbox outbox = createOutbox(roomId, scheduledAt);
        for (int i = 0; i < targetRetryCount; i++) {
            outbox.markAsProcessing(scheduledAt);
            outbox.markAsFailed(scheduledAt);
        }
        return outbox;
    }

    @Nested
    @DisplayName("Claim 패턴 테스트")
    @Transactional
    class ClaimPatternTest {

        @DisplayName("claimPendingOutboxes 호출 시 PENDING → PROCESSING으로 상태가 변경된다")
        @Test
        void claimPendingOutboxes_changeStatusToProcessing() {
            // given
            final Room room = createRoom();
            final PlatformNotificationOutbox outbox = createOutbox(room.getId(), NOW.minus(5, ChronoUnit.MINUTES));
            repository.save(outbox);

            // when
            final List<PlatformNotificationOutbox> claimed = handler.claimPendingOutboxes(NOW, 100);

            // then
            assertSoftly(softly -> {
                softly.assertThat(claimed).hasSize(1);
                softly.assertThat(claimed.getFirst().getStatus()).isEqualTo(OutboxStatus.PROCESSING);
            });
        }

        @DisplayName("claimPendingOutboxes 결과와 DB 상태가 일치한다")
        @Test
        void claimPendingOutboxes_returnsClaimedOutboxes() {
            // given
            final Room room = createRoom();
            final PlatformNotificationOutbox outbox1 = createOutbox(room.getId(), NOW.minus(10, ChronoUnit.MINUTES));
            final PlatformNotificationOutbox outbox2 = createOutbox(room.getId(), NOW.minus(5, ChronoUnit.MINUTES));
            repository.save(outbox1);
            repository.save(outbox2);

            // when
            final List<PlatformNotificationOutbox> claimed = handler.claimPendingOutboxes(NOW, 100);

            // then
            assertSoftly(softly -> {
                assertThat(claimed).hasSize(2);
                claimed.forEach(outbox ->
                        assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.PROCESSING)
                );
            });
        }

        @DisplayName("클레임된 엔티티의 불변식: status=PROCESSING, updatedAt=now, scheduledAt 불변")
        @Test
        void claimPendingOutboxes_invariants_statusProcessing_updatedAtNow_scheduledAtUnchanged() {
            // given
            final Room room = createRoom();
            final Instant originalScheduledAt = NOW.minus(5, ChronoUnit.MINUTES);
            final PlatformNotificationOutbox outbox = createOutbox(room.getId(), originalScheduledAt);
            repository.save(outbox);

            // when
            final List<PlatformNotificationOutbox> claimed = handler.claimPendingOutboxes(NOW, 100);

            // then
            assertSoftly(softly -> {
                softly.assertThat(claimed).hasSize(1);
                final PlatformNotificationOutbox claimedOutbox = claimed.getFirst();
                softly.assertThat(claimedOutbox.getStatus()).isEqualTo(OutboxStatus.PROCESSING);
                softly.assertThat(claimedOutbox.getUpdatedAt()).isEqualTo(NOW);
                softly.assertThat(claimedOutbox.getScheduledAt()).isEqualTo(originalScheduledAt); // 불변
            });
        }
    }

    @Nested
    @DisplayName("전체 처리 흐름 테스트")
    @Transactional
    class ProcessingFlowTest {

        @BeforeEach
        void setUp() {
            given(timeProvider.now()).willReturn(NOW);
        }

        @DisplayName("처리 성공 시 outbox가 COMPLETED 상태가 된다")
        @Test
        void processOutboxes_successfulProcessing_marksAsCompleted() {
            // given
            final Room room = createRoom();
            final PlatformNotificationOutbox outbox = createOutbox(room.getId(), NOW.minus(5, ChronoUnit.MINUTES));
            repository.save(outbox);

            doNothing().when(notificationService).sendNotification(eq(room.getId()), any());

            // when
            orchestrator.processOutboxes(handler, 100);

            // then
            final PlatformNotificationOutbox result = repository.find(outbox.getId()).orElseThrow();
            assertThat(result.getStatus()).isEqualTo(OutboxStatus.COMPLETED);
        }

        @DisplayName("처리 실패 시 outbox가 PENDING 상태로 돌아가고 retryCount가 증가한다")
        @Test
        void processOutboxes_failedProcessing_marksAsFailedAndRetries() {
            // given
            final Room room = createRoom();
            final PlatformNotificationOutbox outbox = createOutbox(room.getId(), NOW.minus(5, ChronoUnit.MINUTES));
            repository.save(outbox);

            doThrow(new RuntimeException("External API failed"))
                    .when(notificationService).sendNotification(eq(room.getId()), any());

            // when
            orchestrator.processOutboxes(handler, 100);

            // then
            final PlatformNotificationOutbox result = repository.find(outbox.getId()).orElseThrow();
            assertSoftly(softly -> {
                softly.assertThat(result.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(result.getRetryCount()).isEqualTo(1);
            });
        }

        @DisplayName("최대 재시도 횟수 초과 시 outbox가 FAILED 상태가 된다")
        @Test
        void processOutboxes_maxRetriesExceeded_marksAsFailed() {
            // given: retryCount가 4인 outbox (다음 실패 시 FAILED)
            // 주의: exponential backoff로 인해 scheduledAt이 변경되므로, 충분히 과거 시간 사용
            // 4번 실패 후 backoff = 8분, 따라서 NOW - 10분으로 설정하면 최종 scheduledAt = NOW - 2분
            final Room room = createRoom();
            final PlatformNotificationOutbox outbox = createOutboxWithRetryCount(room.getId(), 4,
                    NOW.minus(10, ChronoUnit.MINUTES));
            repository.save(outbox);

            doThrow(new RuntimeException("External API failed"))
                    .when(notificationService).sendNotification(eq(room.getId()), any());

            // when
            orchestrator.processOutboxes(handler, 100);

            // then
            final PlatformNotificationOutbox result = repository.find(outbox.getId()).orElseThrow();
            assertSoftly(softly -> {
                softly.assertThat(result.getStatus()).isEqualTo(OutboxStatus.FAILED);
                softly.assertThat(result.getRetryCount()).isEqualTo(5);
            });
        }

        @DisplayName("혼합 처리: 한 배치에서 성공 1, 실패 1일 때 각각 COMPLETED, PENDING+retryCount=1이 된다")
        @Test
        void processOutboxes_mixedResults_eachProcessedIndependently() {
            // given: 2개의 outbox - 하나는 성공, 하나는 실패하도록 설정
            final Room successRoom = createRoom();
            final Room failRoom = createRoom();

            final PlatformNotificationOutbox successOutbox = createOutbox(successRoom.getId(),
                    NOW.minus(10, ChronoUnit.MINUTES));
            final PlatformNotificationOutbox failOutbox = createOutbox(failRoom.getId(),
                    NOW.minus(5, ChronoUnit.MINUTES));
            repository.save(successOutbox);
            repository.save(failOutbox);

            // 성공 outbox 처리
            doNothing().when(notificationService).sendNotification(eq(successRoom.getId()), any());
            // 실패 outbox 처리
            doThrow(new RuntimeException("External API failed"))
                    .when(notificationService).sendNotification(eq(failRoom.getId()), any());

            // when
            orchestrator.processOutboxes(handler, 100);

            // then
            final PlatformNotificationOutbox successResult = repository.find(successOutbox.getId()).orElseThrow();
            final PlatformNotificationOutbox failResult = repository.find(failOutbox.getId()).orElseThrow();

            assertSoftly(softly -> {
                // 성공한 outbox
                softly.assertThat(successResult.getStatus()).isEqualTo(OutboxStatus.COMPLETED);
                softly.assertThat(successResult.getRetryCount()).isEqualTo(0);
                // 실패한 outbox (개별 실패 격리)
                softly.assertThat(failResult.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(failResult.getRetryCount()).isEqualTo(1);
            });
        }

        @DisplayName("No-op 경로: due한 outbox가 없을 때 notificationService 호출이 일어나지 않는다")
        @Test
        void processOutboxes_noDueOutboxes_noServiceCall() {
            // given: due한 outbox 없음 (미래 스케줄)
            final Room room = createRoom();
            final PlatformNotificationOutbox futureOutbox = createOutbox(room.getId(), NOW.plus(1, ChronoUnit.HOURS));
            repository.save(futureOutbox);

            // when
            orchestrator.processOutboxes(handler, 100);

            // then
            verify(notificationService, never()).sendNotification(any(), any());
        }
    }

    @Nested
    @DisplayName("Stale 복구 통합 테스트")
    @Transactional
    class StaleRecoveryTest {

        @BeforeEach
        void setUp() {
            given(timeProvider.now()).willReturn(NOW);
        }

        @DisplayName("10분 이상 지난 PROCESSING outbox가 복구되고 scheduledAt=now+1분(첫 백오프)으로 설정된다")
        @Test
        void recoverStaleOutboxes_recoversOldProcessingRecords_withBackoffSchedule() {
            // given: 15분 전에 PROCESSING 상태가 된 outbox
            final Room room = createRoom();
            final PlatformNotificationOutbox outbox = createOutbox(room.getId(), NOW.minus(20, ChronoUnit.MINUTES));
            outbox.markAsProcessing(NOW.minus(15, ChronoUnit.MINUTES));
            repository.save(outbox);

            // when
            orchestrator.recoverStaleOutboxes(handler, 100);

            // then
            final PlatformNotificationOutbox result = repository.find(outbox.getId()).orElseThrow();
            assertSoftly(softly -> {
                softly.assertThat(result.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(result.getRetryCount()).isEqualTo(1);
                // 첫 번째 백오프: now + 1분
                softly.assertThat(result.getScheduledAt()).isEqualTo(NOW.plus(1, ChronoUnit.MINUTES));
                softly.assertThat(result.getUpdatedAt()).isEqualTo(NOW);
            });
        }

        @DisplayName("10분 미만의 PROCESSING outbox는 복구되지 않는다")
        @Test
        void recoverStaleOutboxes_ignoresRecentProcessingRecords() {
            // given: 5분 전에 PROCESSING 상태가 된 outbox
            final Room room = createRoom();
            final PlatformNotificationOutbox outbox = createOutbox(room.getId(), NOW.minus(10, ChronoUnit.MINUTES));
            outbox.markAsProcessing(NOW.minus(5, ChronoUnit.MINUTES));
            repository.save(outbox);

            // when
            orchestrator.recoverStaleOutboxes(handler, 100);

            // then
            final PlatformNotificationOutbox result = repository.find(outbox.getId()).orElseThrow();
            assertSoftly(softly -> {
                softly.assertThat(result.getStatus()).isEqualTo(OutboxStatus.PROCESSING);
                softly.assertThat(result.getRetryCount()).isEqualTo(0);
            });
        }
    }

    @Nested
    @DisplayName("동시성 테스트 (FOR UPDATE 락 검증)")
    // 주의: @Transactional 제거 - 동시성 테스트에서는 다른 스레드가 데이터를 볼 수 있도록 커밋 필요
    class ConcurrencyTest {

        private final List<Long> createdOutboxIds = new ArrayList<>();
        private Room testRoom;

        @BeforeEach
        void setUp() {
            given(timeProvider.now()).willReturn(NOW);
            testRoom = createRoom();
        }

        @AfterEach
        void tearDown() {
            // 테스트에서 생성한 outbox 정리
            createdOutboxIds.forEach(jpaRepository::deleteById);
            createdOutboxIds.clear();
        }

        @DisplayName("두 스레드가 동시에 claim 시도해도 각 outbox는 한 번만 claim된다")
        @Test
        void claimPendingOutboxes_concurrentClaims_noDoubleClaim() throws Exception {
            // given: 5개의 PENDING outbox 생성
            for (int i = 0; i < 5; i++) {
                final PlatformNotificationOutbox outbox = createOutbox(testRoom.getId(),
                        NOW.minus(i + 1, ChronoUnit.MINUTES));
                final PlatformNotificationOutbox saved = repository.save(outbox);
                createdOutboxIds.add(saved.getId());
            }

            final ExecutorService executor = Executors.newFixedThreadPool(2);
            final CountDownLatch startLatch = new CountDownLatch(1);

            // when: 2개의 스레드가 동시에 claim 시도
            final Future<List<PlatformNotificationOutbox>> future1 = executor.submit(() -> {
                startLatch.await();
                return handler.claimPendingOutboxes(NOW, 5);
            });
            final Future<List<PlatformNotificationOutbox>> future2 = executor.submit(() -> {
                startLatch.await();
                return handler.claimPendingOutboxes(NOW, 5);
            });

            startLatch.countDown(); // 동시 시작

            final List<PlatformNotificationOutbox> result1 = future1.get();
            final List<PlatformNotificationOutbox> result2 = future2.get();

            executor.shutdown();

            // then: 총 5개만 claim됨 (중복 없음)
            final Set<Long> allClaimedIds = new HashSet<>();
            result1.forEach(outbox -> allClaimedIds.add(outbox.getId()));
            result2.forEach(outbox -> allClaimedIds.add(outbox.getId()));

            assertSoftly(softly -> {
                softly.assertThat(allClaimedIds).hasSize(5);
                softly.assertThat(result1.size() + result2.size()).isEqualTo(5);
            });
        }

        @DisplayName("limit와 동시성: 5개 PENDING, 2스레드가 각각 limit=3으로 클레임 시 총 5개, 중복 없이 분배")
        @Test
        void claimPendingOutboxes_limitWithConcurrency_distributedWithoutDuplication() throws Exception {
            // given: 5개의 PENDING outbox 생성
            for (int i = 0; i < 5; i++) {
                final PlatformNotificationOutbox outbox = createOutbox(testRoom.getId(),
                        NOW.minus(i + 1, ChronoUnit.MINUTES));
                final PlatformNotificationOutbox saved = repository.save(outbox);
                createdOutboxIds.add(saved.getId());
            }

            final ExecutorService executor = Executors.newFixedThreadPool(2);
            final CountDownLatch startLatch = new CountDownLatch(1);

            // when: 2개의 스레드가 각각 limit=3으로 claim 시도
            final Future<List<PlatformNotificationOutbox>> future1 = executor.submit(() -> {
                startLatch.await();
                return handler.claimPendingOutboxes(NOW, 3);
            });
            final Future<List<PlatformNotificationOutbox>> future2 = executor.submit(() -> {
                startLatch.await();
                return handler.claimPendingOutboxes(NOW, 3);
            });

            startLatch.countDown(); // 동시 시작

            final List<PlatformNotificationOutbox> result1 = future1.get();
            final List<PlatformNotificationOutbox> result2 = future2.get();

            executor.shutdown();

            // then: 총 5개 claim (각 스레드는 최대 3개씩, 중복 없음)
            final Set<Long> allClaimedIds = new HashSet<>();
            result1.forEach(outbox -> allClaimedIds.add(outbox.getId()));
            result2.forEach(outbox -> allClaimedIds.add(outbox.getId()));

            assertSoftly(softly -> {
                softly.assertThat(allClaimedIds).hasSize(5);
                softly.assertThat(result1.size() + result2.size()).isEqualTo(5);
                // 각 스레드는 최대 3개까지만 가져감
                softly.assertThat(result1.size()).isLessThanOrEqualTo(3);
                softly.assertThat(result2.size()).isLessThanOrEqualTo(3);
            });
        }

        @DisplayName("순차적 재클레임: 첫 클레임 후 즉시 다시 호출 시 빈 결과 반환")
        @Test
        void claimPendingOutboxes_sequentialReclaim_returnsEmpty() {
            // given: 3개의 PENDING outbox 생성
            for (int i = 0; i < 3; i++) {
                final PlatformNotificationOutbox outbox = createOutbox(testRoom.getId(),
                        NOW.minus(i + 1, ChronoUnit.MINUTES));
                final PlatformNotificationOutbox saved = repository.save(outbox);
                createdOutboxIds.add(saved.getId());
            }

            // when: 첫 번째 클레임
            final List<PlatformNotificationOutbox> firstClaim = handler.claimPendingOutboxes(NOW, 100);
            // 두 번째 클레임 (동일 조건)
            final List<PlatformNotificationOutbox> secondClaim = handler.claimPendingOutboxes(NOW, 100);

            // then: 첫 번째는 3개, 두 번째는 빈 결과 (PROCESSING 전이 효과)
            assertSoftly(softly -> {
                softly.assertThat(firstClaim).hasSize(3);
                softly.assertThat(secondClaim).isEmpty();
            });
        }
    }
}
