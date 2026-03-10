package com.estime.room.participant.vote;

import com.estime.room.slot.DateTimeSlot;
import com.estime.shared.Validator;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class VoteId implements Serializable {

    private Long participantId;

    private DateTimeSlot dateTimeSlot;

    public static VoteId of(final Long participantId, final DateTimeSlot dateTimeSlot) {
        validateNull(participantId, dateTimeSlot);
        return new VoteId(participantId, dateTimeSlot);
    }

    private static void validateNull(final Long participantId, final DateTimeSlot dateTimeSlot) {
        Validator.builder()
                .add("participantId", participantId)
                .add("dateTimeSlot", dateTimeSlot)
                .validateNull();
    }
}
