package com.estime.room.participant.vote;

import static org.assertj.core.api.Assertions.assertThat;

import com.estime.room.slot.DateTimeSlot;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class VoteStatisticTest {

    private static final DateTimeSlot SLOT_A = DateTimeSlot.from(0);
    private static final DateTimeSlot SLOT_B = DateTimeSlot.from(1);
    private static final DateTimeSlot SLOT_C = DateTimeSlot.from(2);

    @DisplayName("allParticipantIds() - 모든 슬롯의 참여자 ID를 중복 없이 반환한다")
    @Test
    void allParticipantIds_returns_unique_ids() {
        // given
        final Votes votes = Votes.from(List.of(
                Vote.of(1L, SLOT_A),
                Vote.of(1L, SLOT_B),
                Vote.of(2L, SLOT_A)
        ));

        // when
        final Votes.Statistic statistic = votes.calculateStatistic();

        // then
        assertThat(statistic.allParticipantIds()).containsExactlyInAnyOrder(1L, 2L);
    }

    @DisplayName("dateTimeSlots() - 투표가 존재하는 모든 슬롯을 반환한다")
    @Test
    void dateTimeSlots_returns_all_slots() {
        // given
        final Votes votes = Votes.from(List.of(
                Vote.of(1L, SLOT_A),
                Vote.of(2L, SLOT_B)
        ));

        // when
        final Votes.Statistic statistic = votes.calculateStatistic();

        // then
        assertThat(statistic.dateTimeSlots()).containsExactlyInAnyOrder(SLOT_A, SLOT_B);
    }

    @DisplayName("participantIdsFor() - 특정 슬롯에 투표한 참여자 ID를 반환한다")
    @Test
    void participantIdsFor_returns_ids_for_slot() {
        // given
        final Votes votes = Votes.from(List.of(
                Vote.of(1L, SLOT_A),
                Vote.of(2L, SLOT_A),
                Vote.of(3L, SLOT_B)
        ));

        // when
        final Votes.Statistic statistic = votes.calculateStatistic();

        // then
        assertThat(statistic.participantIdsFor(SLOT_A)).containsExactlyInAnyOrder(1L, 2L);
        assertThat(statistic.participantIdsFor(SLOT_B)).containsExactly(3L);
    }

    @DisplayName("participantIdsFor() - 투표가 없는 슬롯은 빈 Set을 반환한다")
    @Test
    void participantIdsFor_returns_empty_for_unknown_slot() {
        // given
        final Votes votes = Votes.from(List.of(Vote.of(1L, SLOT_A)));

        // when
        final Votes.Statistic statistic = votes.calculateStatistic();

        // then
        assertThat(statistic.participantIdsFor(SLOT_C)).isEmpty();
    }
}
