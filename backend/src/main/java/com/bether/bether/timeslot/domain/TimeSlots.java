package com.bether.bether.timeslot.domain;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TimeSlots {

    private final List<TimeSlot> timeSlots;

    public static TimeSlots from(final List<TimeSlot> timeSlots) {
        if (timeSlots == null) {
            throw new IllegalArgumentException("Time slots cannot be null");
        }
        return new TimeSlots(timeSlots);
    }

    public TimeSlotStatistic calculateStatistic() {
        final Map<LocalDateTime, TimeSlotParticipants> participantsByDateTime = new HashMap<>();

        timeSlots.forEach(timeSlot -> {
            final LocalDateTime dateTime = timeSlot.getStartAt();
            participantsByDateTime.putIfAbsent(dateTime, TimeSlotParticipants.from(dateTime));
            participantsByDateTime.get(dateTime).addUserName(timeSlot.getUserName());
        });

        return TimeSlotStatistic.from(participantsByDateTime);
    }
}
