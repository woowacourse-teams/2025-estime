package com.estime.room.domain.participant;

import com.estime.datetimeslot.DateTimeSlot;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ParticipantDateTimeSlotId implements Serializable {

    private Long participantId;
    private DateTimeSlot dateTimeSlot;

    public static ParticipantDateTimeSlotId of(final Long userId, final DateTimeSlot dateTimeSlot) {
        return new ParticipantDateTimeSlotId(userId, dateTimeSlot);
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof final ParticipantDateTimeSlotId that)) {
            return false;
        }
        return Objects.equals(participantId, that.participantId) &&
                Objects.equals(dateTimeSlot, that.dateTimeSlot);
    }

    @Override
    public int hashCode() {
        return Objects.hash(participantId, dateTimeSlot);
    }
}
