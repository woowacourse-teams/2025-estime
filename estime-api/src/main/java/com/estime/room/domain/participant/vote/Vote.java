package com.estime.room.domain.participant.vote;

import com.estime.common.exception.util.Validator;
import com.estime.room.domain.slot.vo.DateTimeSlot;
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
public class Vote {

    @EmbeddedId
    private VoteId id;

    public static Vote of(final Long participantId, final DateTimeSlot dateTimeSlot) {
        Validator.builder()
                .add("participantId", participantId)
                .add("dateTimeSlot", dateTimeSlot)
                .validateNull();
        return new Vote(VoteId.of(participantId, dateTimeSlot));
    }
}
