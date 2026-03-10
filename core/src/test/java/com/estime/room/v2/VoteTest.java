package com.estime.room.v2;

import static org.assertj.core.api.Assertions.assertThat;

import com.estime.room.participant.vote.Vote;
import com.estime.room.slot.DateTimeSlot;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("Vote 테스트")
class VoteTest {

    private static final long PARTICIPANT_ID = 1L;

    @Test
    @DisplayName("Vote 생성 및 필드 조회")
    void createVote() {
        // given
        final DateTimeSlot slot = DateTimeSlot.from(3603);

        // when
        final Vote vote = Vote.of(PARTICIPANT_ID, slot);

        // then
        assertThat(vote.getParticipantId()).isEqualTo(PARTICIPANT_ID);
        assertThat(vote.getDateTimeSlot()).isEqualTo(slot);
        assertThat(vote.getId()).isNotNull();
        assertThat(vote.getId().getParticipantId()).isEqualTo(PARTICIPANT_ID);
        assertThat(vote.getId().getDateTimeSlot()).isEqualTo(slot);
    }
}
