package com.estime.room.domain.participant.slot;

import com.estime.datetimeslot.DateTimeSlot;
import java.util.Map;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DateTimeSlotStatistic {

    private final Map<DateTimeSlot, DateTimeSlotParticipants> participantsByDateTime;

    public static DateTimeSlotStatistic from(
            final Map<DateTimeSlot, DateTimeSlotParticipants> participantsByDateTime) {

        Objects.requireNonNull(participantsByDateTime, "participantsByDateTime cannot be null");
        return new DateTimeSlotStatistic(participantsByDateTime);
    }
}
