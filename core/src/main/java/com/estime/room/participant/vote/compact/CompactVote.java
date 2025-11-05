package com.estime.room.participant.vote.compact;

import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.shared.Validator;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
@EqualsAndHashCode
public class CompactVote {

    @EmbeddedId
    private CompactVoteId id;

    public static CompactVote of(
            final Long participantId,
            final CompactDateTimeSlot compactDateTimeSlot
    ) {
        Validator.builder()
                .add("participantId", participantId)
                .add("compactDateTimeSlot", compactDateTimeSlot)
                .validateNull();
        return new CompactVote(CompactVoteId.of(participantId, compactDateTimeSlot));
    }

    public Long getParticipantId() {
        return id.getParticipantId();
    }

    public CompactDateTimeSlot getCompactDateTimeSlot() {
        return id.getCompactDateTimeSlot();
    }
}
