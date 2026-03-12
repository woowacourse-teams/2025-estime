package com.estime.room.service;

import static org.assertj.core.api.SoftAssertions.assertSoftly;
import static org.mockito.BDDMockito.given;

import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.dto.input.VotesUpdateInput;
import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.participant.vote.Vote;
import com.estime.room.participant.vote.VoteRepository;
import com.estime.room.slot.DateTimeSlot;
import com.estime.support.IntegrationTest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.transaction.support.TransactionTemplate;

@DisplayName("투표 수정 낙관적 락 테스트")
class OptimisticLockVoteUpdateTest extends IntegrationTest {

    @Autowired
    private RoomApplicationService roomApplicationService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private TransactionTemplate transactionTemplate;

    private Room room;
    private Participant participant;
    private DateTimeSlot slotA;
    private DateTimeSlot slotB;
    private DateTimeSlot slotC;

    @BeforeEach
    void setUp() {
        final LocalDateTime date = NOW_LOCAL_DATE.plusDays(1).atTime(LocalTime.of(10, 0));
        slotA = DateTimeSlot.from(date.atZone(ZONE).toInstant());
        slotB = DateTimeSlot.from(date.plusMinutes(30).atZone(ZONE).toInstant());
        slotC = DateTimeSlot.from(date.plusHours(1).atZone(ZONE).toInstant());

        room = roomRepository.save(Room.withoutId(
                "낙관적락테스트",
                RoomSession.from(UUID.randomUUID().toString()),
                NOW_LOCAL_DATE_TIME.plusDays(3).atZone(ZONE).toInstant(),
                List.of(slotA, slotB, slotC),
                NOW
        ));

        participant = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("testUser"))
        );

        voteRepository.save(Vote.of(participant.getId(), slotA));
    }

    @AfterEach
    void tearDown() {
        transactionTemplate.executeWithoutResult(status -> {
            voteRepository.deleteAllInBatch(voteRepository.findAllByParticipantId(participant.getId()));
            participantRepository.findByRoomIdAndName(room.getId(), participant.getName())
                    .ifPresent(p -> participantRepository.save(p));
        });
    }

    @DisplayName("동일 참여자가 다른 슬롯을 동시에 추가하면 version 불일치로 충돌이 발생한다")
    @Test
    void concurrentVoteUpdate_differentSlots_onlyOneSucceeds() throws Exception {
        // given
        final VotesUpdateInput input1 = new VotesUpdateInput(
                room.getSession(), participant.getName(), List.of(slotA, slotB));
        final VotesUpdateInput input2 = new VotesUpdateInput(
                room.getSession(), participant.getName(), List.of(slotA, slotC));

        final ExecutorService executor = Executors.newFixedThreadPool(2);
        final CountDownLatch startLatch = new CountDownLatch(1);
        final AtomicInteger successCount = new AtomicInteger(0);
        final AtomicInteger failCount = new AtomicInteger(0);

        // when
        final Future<?> future1 = executor.submit(() -> {
            try {
                startLatch.await();
                roomApplicationService.updateParticipantVotes(input1);
                successCount.incrementAndGet();
            } catch (final OptimisticLockingFailureException e) {
                failCount.incrementAndGet();
            } catch (final InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        final Future<?> future2 = executor.submit(() -> {
            try {
                startLatch.await();
                roomApplicationService.updateParticipantVotes(input2);
                successCount.incrementAndGet();
            } catch (final OptimisticLockingFailureException e) {
                failCount.incrementAndGet();
            } catch (final InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        startLatch.countDown();
        future1.get();
        future2.get();
        executor.shutdown();

        // then
        assertSoftly(softly -> {
            softly.assertThat(successCount.get()).isEqualTo(1);
            softly.assertThat(failCount.get()).isEqualTo(1);
        });
    }

    @DisplayName("동일 참여자가 같은 슬롯을 동시에 추가하면 PK 중복으로 충돌이 발생한다")
    @Test
    void concurrentVoteUpdate_sameSlot_onlyOneSucceeds() throws Exception {
        // given
        final VotesUpdateInput input1 = new VotesUpdateInput(
                room.getSession(), participant.getName(), List.of(slotA, slotB));
        final VotesUpdateInput input2 = new VotesUpdateInput(
                room.getSession(), participant.getName(), List.of(slotA, slotB));

        final ExecutorService executor = Executors.newFixedThreadPool(2);
        final CountDownLatch startLatch = new CountDownLatch(1);
        final AtomicInteger successCount = new AtomicInteger(0);
        final AtomicInteger failCount = new AtomicInteger(0);

        // when
        final Future<?> future1 = executor.submit(() -> {
            try {
                startLatch.await();
                roomApplicationService.updateParticipantVotes(input1);
                successCount.incrementAndGet();
            } catch (final DataIntegrityViolationException e) {
                failCount.incrementAndGet();
            } catch (final InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        final Future<?> future2 = executor.submit(() -> {
            try {
                startLatch.await();
                roomApplicationService.updateParticipantVotes(input2);
                successCount.incrementAndGet();
            } catch (final DataIntegrityViolationException e) {
                failCount.incrementAndGet();
            } catch (final InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        startLatch.countDown();
        future1.get();
        future2.get();
        executor.shutdown();

        // then
        assertSoftly(softly -> {
            softly.assertThat(successCount.get()).isEqualTo(1);
            softly.assertThat(failCount.get()).isEqualTo(1);
        });
    }

    @DisplayName("순차 투표 수정은 version이 정상적으로 증가하며 모두 성공한다")
    @Test
    void sequentialVoteUpdate_allSucceed() {
        // given
        final Instant firstTime = NOW;
        final Instant secondTime = NOW.plus(1, ChronoUnit.SECONDS);

        final VotesUpdateInput input1 = new VotesUpdateInput(
                room.getSession(), participant.getName(), List.of(slotA, slotB));
        final VotesUpdateInput input2 = new VotesUpdateInput(
                room.getSession(), participant.getName(), List.of(slotB, slotC));

        // when
        given(timeProvider.now()).willReturn(firstTime);
        roomApplicationService.updateParticipantVotes(input1);
        given(timeProvider.now()).willReturn(secondTime);
        roomApplicationService.updateParticipantVotes(input2);

        // then
        final Participant updated = participantRepository.findByRoomIdAndName(
                room.getId(), participant.getName()).orElseThrow();
        assertSoftly(softly -> {
            softly.assertThat(updated.getVersion()).isEqualTo(2L);
            softly.assertThat(updated.getLastVotedAt()).isEqualTo(secondTime);
        });
    }

    @DisplayName("투표 수정 시 Participant의 version과 lastVotedAt이 갱신된다")
    @Test
    void updateParticipantVotes_updatesVersionAndLastVotedAt() {
        // given
        final VotesUpdateInput input = new VotesUpdateInput(
                room.getSession(), participant.getName(), List.of(slotA, slotB));

        // when
        roomApplicationService.updateParticipantVotes(input);

        // then
        final Participant updated = participantRepository.findByRoomIdAndName(
                room.getId(), participant.getName()).orElseThrow();
        assertSoftly(softly -> {
            softly.assertThat(participant.getVersion()).isZero();
            softly.assertThat(updated.getVersion()).isEqualTo(1L);
            softly.assertThat(updated.getLastVotedAt()).isEqualTo(NOW);
        });
    }
}
