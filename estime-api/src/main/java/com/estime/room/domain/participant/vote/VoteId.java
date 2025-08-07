package com.estime.room.domain.participant.vote;

import com.estime.common.exception.util.Validator;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.infrastructure.converter.DateTimeSlotConverter;
import jakarta.persistence.Convert;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode
public class VoteId implements Serializable {

    private Long participantId;

    @Convert(converter = DateTimeSlotConverter.class)
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
