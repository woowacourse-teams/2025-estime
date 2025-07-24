package com.bether.bether.datetimeslot.domain;

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
public class DateTimeSlots {

    private final List<DateTimeSlot> dateTimeSlots;

    public static DateTimeSlots from(final List<DateTimeSlot> dateTimeSlots) {
        if (dateTimeSlots == null) {
            throw new IllegalArgumentException("Time slots cannot be null");
        }
        return new DateTimeSlots(List.copyOf(dateTimeSlots));
    }

    public DateTimeSlotStatistic calculateStatistic() {
        final Map<LocalDateTime, DateTimeSlotParticipants> participantsByDateTime = new HashMap<>();

        dateTimeSlots.forEach(timeSlot -> {
            final LocalDateTime dateTime = timeSlot.getStartAt();
            participantsByDateTime.putIfAbsent(dateTime, DateTimeSlotParticipants.from(dateTime));
            participantsByDateTime.get(dateTime).addUserName(timeSlot.getUserName());
        });

        return DateTimeSlotStatistic.from(participantsByDateTime);
    }

    public Set<LocalDateTime> calculateUniqueStartAts() {
        return dateTimeSlots.stream()
                .map(DateTimeSlot::getStartAt)
                .collect(Collectors.toSet());
    }

    public DateTimeSlots findSlotsToSave(
            final Set<LocalDateTime> requestedStartAts,
            final Long roomId,
            final String userName
    ) {
        final Set<LocalDateTime> existingStartAts = calculateUniqueStartAts();
        return new DateTimeSlots(requestedStartAts.stream()
                .filter(startAt -> !existingStartAts.contains(startAt))
                .map(startAt -> DateTimeSlot.withoutId(roomId, userName, startAt))
                .toList());
    }

    public DateTimeSlots findSlotsToDelete(final Set<LocalDateTime> requestedStartAts) {
        return new DateTimeSlots(dateTimeSlots.stream()
                .filter(timeSlot -> !requestedStartAts.contains(timeSlot.getStartAt()))
                .toList());
    }

    public boolean isEmpty() {
        return dateTimeSlots.isEmpty();
    }

    public boolean isNotEmpty() {
        return !isEmpty();
    }
}
