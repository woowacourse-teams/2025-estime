package com.estime.room.participant.vote;

import static org.assertj.core.api.Assertions.assertThat;

import com.estime.room.slot.DateTimeSlot;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class VotesDiffTest {

    private static final long PARTICIPANT_ID = 1L;

    private Vote slotA;
    private Vote slotB;
    private Vote slotC;

    @BeforeEach
    void setUp() {
        slotA = Vote.of(PARTICIPANT_ID, DateTimeSlot.from(0));
        slotB = Vote.of(PARTICIPANT_ID, DateTimeSlot.from(1));
        slotC = Vote.of(PARTICIPANT_ID, DateTimeSlot.from(2));
    }

    @DisplayName("diff() - 추가된 투표와 삭제된 투표를 분리한다")
    @Test
    void diff_separates_additions_and_removals() {
        // given
        final Votes origin = Votes.from(List.of(slotA, slotB));
        final Votes updated = Votes.from(List.of(slotB, slotC));

        // when
        final Votes.Diff diff = origin.diff(updated);

        // then
        assertThat(diff.toRemove().getElements()).containsExactly(slotA);
        assertThat(diff.toAdd().getElements()).containsExactly(slotC);
    }

    @DisplayName("diff() - 동일한 투표면 추가/삭제 모두 비어 있다")
    @Test
    void diff_identical_votes_produces_empty_diff() {
        // given
        final Votes origin = Votes.from(List.of(slotA));
        final Votes updated = Votes.from(List.of(slotA));

        // when
        final Votes.Diff diff = origin.diff(updated);

        // then
        assertThat(diff.toRemove().isEmpty()).isTrue();
        assertThat(diff.toAdd().isEmpty()).isTrue();
    }

    @DisplayName("diff() - 모든 투표가 교체되는 경우")
    @Test
    void diff_complete_replacement() {
        // given
        final Votes origin = Votes.from(List.of(slotA));
        final Votes updated = Votes.from(List.of(slotB));

        // when
        final Votes.Diff diff = origin.diff(updated);

        // then
        assertThat(diff.toRemove().getElements()).containsExactly(slotA);
        assertThat(diff.toAdd().getElements()).containsExactly(slotB);
    }
}
