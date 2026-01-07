package com.estime.room;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.estime.cache.CacheNames;
import com.estime.port.out.RoomSessionGenerator;
import com.estime.room.dto.input.RoomSessionInput;
import com.estime.room.dto.input.VotesUpdateInput;
import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.participant.vote.Vote;
import com.estime.room.participant.vote.VoteRepository;
import com.estime.room.service.RoomApplicationService;
import com.estime.room.slot.AvailableDateSlot;
import com.estime.room.slot.AvailableDateSlotRepository;
import com.estime.room.slot.AvailableTimeSlot;
import com.estime.room.slot.AvailableTimeSlotRepository;
import com.estime.room.slot.DateTimeSlot;
import com.estime.support.IntegrationTest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.transaction.annotation.Transactional;

class VoteStatisticCacheTest extends IntegrationTest {

    @Autowired
    private RoomApplicationService roomApplicationService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private AvailableDateSlotRepository availableDateSlotRepository;

    @Autowired
    private AvailableTimeSlotRepository availableTimeSlotRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private RoomSessionGenerator roomSessionGenerator;

    @MockitoSpyBean
    private VoteRepository voteRepository;

    @Autowired
    private CacheManager cacheManager;

    private Room room;
    private Participant participant;
    private DateTimeSlot slot;

    @BeforeEach
    void setUp() {
        cacheManager.getCache(CacheNames.VOTE_STATISTIC).clear();

        final RoomSession roomSession = RoomSession.from(roomSessionGenerator.generate().toString());
        room = roomRepository.save(Room.withoutId(
                "cacheTest",
                roomSession,
                LocalDateTime.of(LocalDate.now().plusDays(3), LocalTime.of(10, 0))
        ));

        availableDateSlotRepository.save(AvailableDateSlot.of(room.getId(), LocalDate.now().plusDays(1)));
        availableTimeSlotRepository.save(AvailableTimeSlot.of(room.getId(), LocalTime.of(10, 0)));

        participant = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("CTU"))
        );

        slot = DateTimeSlot.from(LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        voteRepository.save(Vote.of(participant.getId(), slot));
    }

    @Transactional
    @DisplayName("같은 세션으로 여러 번 조회 시 캐시 히트되어 Repository 조회가 1회만 실행된다")
    @Test
    void cacheHit_sameSession() {
        // given
        final RoomSessionInput input = RoomSessionInput.from(room.getSession());

        // when
        roomApplicationService.calculateVoteStatistic(input);
        roomApplicationService.calculateVoteStatistic(input);
        roomApplicationService.calculateVoteStatistic(input);

        // then
        verify(voteRepository, times(1)).findAllByParticipantIds(anyList());
    }

    @Transactional
    @DisplayName("투표 수정 시 캐시가 무효화되어 다음 조회에서 Repository를 다시 호출한다")
    @Test
    void cacheEvict_afterVoteUpdate() {
        // given
        final RoomSessionInput sessionInput = RoomSessionInput.from(room.getSession());
        final VotesUpdateInput updateInput = new VotesUpdateInput(
                room.getSession(),
                participant.getName(),
                List.of(slot)
        );

        // when
        roomApplicationService.calculateVoteStatistic(sessionInput);  // 1회 - DB 조회
        roomApplicationService.updateParticipantVotes(updateInput);   // 캐시 evict
        roomApplicationService.calculateVoteStatistic(sessionInput);  // 2회 - 캐시 무효화로 다시 DB 조회

        // then
        verify(voteRepository, times(2)).findAllByParticipantIds(anyList());
    }

    @DisplayName("동시에 여러 요청이 들어와도 sync=true 덕분에 Repository 조회가 1회만 실행된다")
    @Test
    void concurrentRequests_withSyncTrue_shouldQueryOnlyOnce() throws InterruptedException {
        // given
        final int concurrentRequests = 20;
        final RoomSessionInput input = RoomSessionInput.from(room.getSession());
        final ExecutorService executor = Executors.newFixedThreadPool(concurrentRequests);
        final CountDownLatch readyLatch = new CountDownLatch(concurrentRequests);
        final CountDownLatch startLatch = new CountDownLatch(1);
        final CountDownLatch doneLatch = new CountDownLatch(concurrentRequests);
        final AtomicInteger successCount = new AtomicInteger(0);

        // when
        for (int i = 0; i < concurrentRequests; i++) {
            executor.submit(() -> {
                try {
                    readyLatch.countDown();
                    startLatch.await();

                    roomApplicationService.calculateVoteStatistic(input);
                    successCount.incrementAndGet();
                } catch (final Exception e) {
                    e.printStackTrace();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        readyLatch.await();
        startLatch.countDown();
        doneLatch.await();
        executor.shutdown();

        // then
        assertThat(successCount.get()).isEqualTo(concurrentRequests);
        verify(voteRepository, times(1)).findAllByParticipantIds(anyList());
    }
}
