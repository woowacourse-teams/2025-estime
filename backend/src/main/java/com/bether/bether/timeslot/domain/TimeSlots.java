package com.bether.bether.timeslot.domain;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
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
        return new TimeSlots(List.copyOf(timeSlots));
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

    public Set<LocalDateTime> calculateUniqueStartAts() {
        return timeSlots.stream()
                .map(TimeSlot::getStartAt)
                .collect(Collectors.toSet());
    }

    public TimeSlots findSlotsToSave(
            final Set<LocalDateTime> requestedStartAts,
            final Long roomId,
            final String userName
    ) {
        final Set<LocalDateTime> existingStartAts = calculateUniqueStartAts();
        return new TimeSlots(requestedStartAts.stream()
                .filter(startAt -> !existingStartAts.contains(startAt))
                .map(startAt -> TimeSlot.withoutId(roomId, userName, startAt))
                .toList());
    }

    public TimeSlots findSlotsToDelete(final Set<LocalDateTime> requestedStartAts) {
        return new TimeSlots(timeSlots.stream()
                .filter(timeSlot -> !requestedStartAts.contains(timeSlot.getStartAt()))
                .toList());
    }

    public boolean isEmpty() {
        return timeSlots.isEmpty();
    }

    public boolean isNotEmpty() {
        return !isEmpty();
    }
}
