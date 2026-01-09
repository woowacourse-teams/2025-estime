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
import java.util.concurrent.CompletableFuture;
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
     * 테스트용 Room 저장 헬퍼
     */
    private Room saveRoom() {
        final Room room = Room.withoutId(
                "테스트방",
                RoomSession.from(UUID.randomUUID().toString()),
                LocalDateTime.now().plusDays(7)
        );
        return roomRepository.save(room);
    }

    /**
     * 테스트용 PlatformNotificationOutbox 빌드 헬퍼 (저장하지 않음)
     */
    private PlatformNotificationOutbox buildOutbox(
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
     * 특정 retryCount를 가진 outbox 빌드 헬퍼 (저장하지 않음)
     */
    private PlatformNotificationOutbox buildOutboxWithRetryCount(
            final Long roomId,
            final int targetRetryCount,
            final Instant scheduledAt
    ) {
        final PlatformNotificationOutbox outbox = buildOutbox(roomId, scheduledAt);
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
            final Room room = saveRoom();
            final PlatformNotificationOutbox outbox = buildOutbox(room.getId(), NOW.minus(5, ChronoUnit.MINUTES));
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
            final Room room = saveRoom();
            final PlatformNotificationOutbox outbox1 = buildOutbox(room.getId(), NOW.minus(10, ChronoUnit.MINUTES));
            final PlatformNotificationOutbox outbox2 = buildOutbox(room.getId(), NOW.minus(5, ChronoUnit.MINUTES));
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
            final Room room = saveRoom();
            final Instant originalScheduledAt = NOW.minus(5, ChronoUnit.MINUTES);
            final PlatformNotificationOutbox outbox = buildOutbox(room.getId(), originalScheduledAt);
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

        @DisplayName("배치 크기 경계: 정확히 100개 outbox가 있을 때 100개 모두 클레임된다")
        @Test
        void claimPendingOutboxes_exactlyBatchSize_allClaimed() {
            // given
            final Room room = saveRoom();
            final int batchSize = 100;
            for (int i = 0; i < batchSize; i++) {
                final PlatformNotificationOutbox outbox = buildOutbox(room.getId(), NOW.minus(i + 1, ChronoUnit.MINUTES));
                repository.save(outbox);
            }

            // when
            final List<PlatformNotificationOutbox> claimed = handler.claimPendingOutboxes(NOW, batchSize);

            // then
            assertThat(claimed).hasSize(batchSize);
        }

        @DisplayName("배치 크기 경계: 101개 outbox가 있을 때 100개만 클레임되고 1개는 남는다")
        @Test
        void claimPendingOutboxes_overBatchSize_onlyBatchSizeClaimed() {
            // given
            final Room room = saveRoom();
            final int batchSize = 100;
            final int totalCount = 101;
            for (int i = 0; i < totalCount; i++) {
                final PlatformNotificationOutbox outbox = buildOutbox(room.getId(), NOW.minus(i + 1, ChronoUnit.MINUTES));
                repository.save(outbox);
            }

            // when: 첫 번째 클레임 - 100개
            final List<PlatformNotificationOutbox> firstClaim = handler.claimPendingOutboxes(NOW, batchSize);
            // when: 두 번째 클레임 - 남은 1개
            final List<PlatformNotificationOutbox> secondClaim = handler.claimPendingOutboxes(NOW, batchSize);

            // then
            assertSoftly(softly -> {
                softly.assertThat(firstClaim).hasSize(batchSize);
                softly.assertThat(secondClaim).hasSize(1);
            });
        }

        @DisplayName("클레임 정렬 보장: limit < due 수량일 때 scheduledAt 오름차순으로 우선 처리된다")
        @Test
        void claimPendingOutboxes_limitLessThanDue_oldestScheduledAtFirst() {
            // given: 5개의 outbox를 다양한 scheduledAt으로 생성
            final Room room = saveRoom();
            final Instant oldest = NOW.minus(50, ChronoUnit.MINUTES);
            final Instant secondOldest = NOW.minus(40, ChronoUnit.MINUTES);
            final Instant middle = NOW.minus(30, ChronoUnit.MINUTES);
            final Instant secondNewest = NOW.minus(20, ChronoUnit.MINUTES);
            final Instant newest = NOW.minus(10, ChronoUnit.MINUTES);

            // 순서 섞어서 저장 (DB 삽입 순서가 결과에 영향 없음을 검증)
            repository.save(buildOutbox(room.getId(), middle));
            repository.save(buildOutbox(room.getId(), newest));
            repository.save(buildOutbox(room.getId(), oldest));
            repository.save(buildOutbox(room.getId(), secondNewest));
            repository.save(buildOutbox(room.getId(), secondOldest));

            // when: limit=3으로 클레임 (5개 중 3개만)
            final List<PlatformNotificationOutbox> claimed = handler.claimPendingOutboxes(NOW, 3);

            // then: 가장 오래된 3개가 scheduledAt 오름차순으로 선택됨
            assertSoftly(softly -> {
                softly.assertThat(claimed).hasSize(3);
                softly.assertThat(claimed.get(0).getScheduledAt()).isEqualTo(oldest);
                softly.assertThat(claimed.get(1).getScheduledAt()).isEqualTo(secondOldest);
                softly.assertThat(claimed.get(2).getScheduledAt()).isEqualTo(middle);
            });
        }
    }

    @Nested
    @DisplayName("전체 처리 흐름 테스트")
            // 주의: @Transactional 제거 - async 콜백이 새 트랜잭션에서 실행되므로 테스트 트랜잭션과 충돌
    class ProcessingFlowTest {

        private final List<Long> createdOutboxIds = new ArrayList<>();

        @AfterEach
        void tearDown() {
            createdOutboxIds.forEach(jpaRepository::deleteById);
            createdOutboxIds.clear();
        }

        private PlatformNotificationOutbox saveOutbox(final Long roomId, final Instant scheduledAt) {
            final PlatformNotificationOutbox outbox = buildOutbox(roomId, scheduledAt);
            final PlatformNotificationOutbox saved = repository.save(outbox);
            createdOutboxIds.add(saved.getId());
            return saved;
        }

        private PlatformNotificationOutbox saveOutboxWithRetryCount(
                final Long roomId,
                final int targetRetryCount,
                final Instant scheduledAt
        ) {
            final PlatformNotificationOutbox outbox = buildOutboxWithRetryCount(roomId, targetRetryCount, scheduledAt);
            final PlatformNotificationOutbox saved = repository.save(outbox);
            createdOutboxIds.add(saved.getId());
            return saved;
        }

        @DisplayName("처리 성공 시 outbox가 COMPLETED 상태가 된다")
        @Test
        void processOutboxes_successfulProcessing_marksAsCompleted() {
            // given
            final Room room = saveRoom();
            final PlatformNotificationOutbox outbox = saveOutbox(room.getId(),
                    NOW.minus(5, ChronoUnit.MINUTES));

            given(notificationService.sendNotification(eq(room.getId()), any()))
                    .willReturn(CompletableFuture.completedFuture(null));

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
            final Room room = saveRoom();
            final PlatformNotificationOutbox outbox = saveOutbox(room.getId(),
                    NOW.minus(5, ChronoUnit.MINUTES));

            given(notificationService.sendNotification(eq(room.getId()), any()))
                    .willReturn(CompletableFuture.failedFuture(new RuntimeException("External API failed")));

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
            final Room room = saveRoom();
            final PlatformNotificationOutbox outbox = saveOutboxWithRetryCount(room.getId(), 4,
                    NOW.minus(10, ChronoUnit.MINUTES));

            given(notificationService.sendNotification(eq(room.getId()), any()))
                    .willReturn(CompletableFuture.failedFuture(new RuntimeException("External API failed")));

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
            final Room successRoom = saveRoom();
            final Room failRoom = saveRoom();

            final PlatformNotificationOutbox successOutbox = saveOutbox(successRoom.getId(),
                    NOW.minus(10, ChronoUnit.MINUTES));
            final PlatformNotificationOutbox failOutbox = saveOutbox(failRoom.getId(),
                    NOW.minus(5, ChronoUnit.MINUTES));

            // 성공 outbox 처리
            given(notificationService.sendNotification(eq(successRoom.getId()), any()))
                    .willReturn(CompletableFuture.completedFuture(null));
            // 실패 outbox 처리
            given(notificationService.sendNotification(eq(failRoom.getId()), any()))
                    .willReturn(CompletableFuture.failedFuture(new RuntimeException("External API failed")));

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
            final Room room = saveRoom();
            final PlatformNotificationOutbox futureOutbox = saveOutbox(room.getId(),
                    NOW.plus(1, ChronoUnit.HOURS));

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

        @DisplayName("10분 이상 지난 PROCESSING outbox가 복구되고 scheduledAt=now+1분(첫 백오프)으로 설정된다")
        @Test
        void recoverStaleOutboxes_recoversOldProcessingRecords_withBackoffSchedule() {
            // given: 15분 전에 PROCESSING 상태가 된 outbox
            final Room room = saveRoom();
            final PlatformNotificationOutbox outbox = buildOutbox(room.getId(), NOW.minus(20, ChronoUnit.MINUTES));
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
            final Room room = saveRoom();
            final PlatformNotificationOutbox outbox = buildOutbox(room.getId(), NOW.minus(10, ChronoUnit.MINUTES));
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

        @DisplayName("Stale 경계값: updatedAt == now - 10분 (정확히 threshold)일 때 복구 대상에 포함된다 (loe)")
        @Test
        void recoverStaleOutboxes_exactlyThreshold_included() {
            // given: 정확히 10분 전에 PROCESSING 상태가 된 outbox (경계값)
            final Room room = saveRoom();
            final PlatformNotificationOutbox outbox = buildOutbox(room.getId(), NOW.minus(15, ChronoUnit.MINUTES));
            outbox.markAsProcessing(NOW.minus(10, ChronoUnit.MINUTES)); // 정확히 threshold
            repository.save(outbox);

            // when
            orchestrator.recoverStaleOutboxes(handler, 100);

            // then: loe(threshold)이므로 포함됨
            final PlatformNotificationOutbox result = repository.find(outbox.getId()).orElseThrow();
            assertSoftly(softly -> {
                softly.assertThat(result.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(result.getRetryCount()).isEqualTo(1);
            });
        }

        @DisplayName("Stale 경계값: updatedAt == now - 10분 + 1초 (threshold 직전)일 때 복구 대상에서 제외된다")
        @Test
        void recoverStaleOutboxes_justBeforeThreshold_excluded() {
            // given: 10분 - 1초 전에 PROCESSING 상태가 된 outbox (경계값 직전)
            final Room room = saveRoom();
            final PlatformNotificationOutbox outbox = buildOutbox(room.getId(), NOW.minus(15, ChronoUnit.MINUTES));
            outbox.markAsProcessing(NOW.minus(10, ChronoUnit.MINUTES).plusSeconds(1)); // threshold - 1초
            repository.save(outbox);

            // when
            orchestrator.recoverStaleOutboxes(handler, 100);

            // then: threshold 이전이므로 제외됨
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
            testRoom = saveRoom();
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
                final PlatformNotificationOutbox outbox = buildOutbox(testRoom.getId(),
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
                final PlatformNotificationOutbox outbox = buildOutbox(testRoom.getId(),
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
                final PlatformNotificationOutbox outbox = buildOutbox(testRoom.getId(),
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
