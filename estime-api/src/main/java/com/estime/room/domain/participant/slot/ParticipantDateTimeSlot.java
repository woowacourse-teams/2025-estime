package com.estime.room.domain.participant.slot;

import com.estime.datetimeslot.DateTimeSlot;
import com.estime.room.domain.participant.ParticipantDateTimeSlotId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "user_date_time_slot")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ToString
public class ParticipantDateTimeSlot {

    @EmbeddedId
    private ParticipantDateTimeSlotId id;

    public static ParticipantDateTimeSlot of(final Long userId, final DateTimeSlot dateTimeSlot) {
        validate(userId, dateTimeSlot);
        return new ParticipantDateTimeSlot(ParticipantDateTimeSlotId.of(userId, dateTimeSlot));
    }

    private static void validate(final Long userId, final DateTimeSlot dateTimeSlot) {
        Objects.requireNonNull(dateTimeSlot, "dateTimeSlot cannot be null");
        Objects.requireNonNull(userId, "userId cannot be null");
    }

    public DateTimeSlot getDateTimeSlot() {
        return id.getDateTimeSlot();
    }

    public Long getParticipantId() {
        return id.getParticipantId();
    }
}
