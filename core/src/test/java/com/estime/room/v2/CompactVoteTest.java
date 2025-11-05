package com.estime.room.v2;

import com.estime.room.participant.vote.compact.CompactVote;
import com.estime.room.slot.CompactDateTimeSlot;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("CompactVote 테스트")
class CompactVoteTest {

    private static final long PARTICIPANT_ID = 1L;

    @Test
    @DisplayName("CompactVote 생성 및 필드 조회")
    void createCompactVote() {
        // given
        final CompactDateTimeSlot slot = CompactDateTimeSlot.from(3603);

        // when
        final CompactVote vote = CompactVote.of(PARTICIPANT_ID, slot);

        // then
        assertThat(vote.getParticipantId()).isEqualTo(PARTICIPANT_ID);
        assertThat(vote.getCompactDateTimeSlot()).isEqualTo(slot);
        assertThat(vote.getId()).isNotNull();
        assertThat(vote.getId().getParticipantId()).isEqualTo(PARTICIPANT_ID);
        assertThat(vote.getId().getCompactDateTimeSlot()).isEqualTo(slot);
    }
}
