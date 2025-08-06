package com.estime.room.domain.participant.vote;

import com.estime.room.domain.slot.vo.DateTimeSlot;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
public class Vote {

    @EmbeddedId
    private VoteId id;

    public static Vote of(final Long participantId, final DateTimeSlot dateTimeSlot) {
        validate(participantId, dateTimeSlot);
        return new Vote(VoteId.of(participantId, dateTimeSlot));
    }

    private static void validate(final Long participantId, final DateTimeSlot dateTimeSlot) {
        Objects.requireNonNull(participantId, "participantId cannot be null");
        Objects.requireNonNull(dateTimeSlot, "dateTimeSlot cannot be null");
    }
}
