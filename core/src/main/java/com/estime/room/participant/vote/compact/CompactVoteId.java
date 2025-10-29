package com.estime.room.participant.vote.compact;

import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.shared.Validator;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode
public class CompactVoteId implements Serializable {

    private Long participantId;

    private CompactDateTimeSlot compactDateTimeSlot;

    public static CompactVoteId of(final Long participantId, final CompactDateTimeSlot dateTimeSlot) {
        validateNull(participantId, dateTimeSlot);
        return new CompactVoteId(participantId, dateTimeSlot);
    }

    private static void validateNull(final Long participantId, final CompactDateTimeSlot compactDateTimeSlot) {
        Validator.builder()
                .add("participantId", participantId)
                .add("compactDateTimeSlot", compactDateTimeSlot)
                .validateNull();
    }
}
