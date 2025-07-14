package com.bether.bether.timeslot.domain;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TotalTimeSlotCount {

    private final Map<LocalDateTime, TimeSlotCount> dateTimeCount;

    public TotalTimeSlotCount() {
        this.dateTimeCount = new HashMap<>();
    }

    public void calculate(final List<TimeSlot> timeSlots) {
        for (TimeSlot timeSlot : timeSlots) {
            addTimeSlot(timeSlot);
        }
    }

    public List<TimeSlotCount> getRank() {
        return dateTimeCount.values()
                .stream()
                .sorted(Comparator.comparingInt(TimeSlotCount::getCount).reversed())
                .toList();
    }

    private void addTimeSlot(final TimeSlot timeSlot) {
        final LocalDateTime dateTime = timeSlot.getStartAt();
        final String userName = timeSlot.getUserName();

        dateTimeCount.putIfAbsent(dateTime, new TimeSlotCount(dateTime));
        dateTimeCount.computeIfPresent(dateTime, ((dateTimeKey, timeSlotCount) -> {
            timeSlotCount.addUserName(userName);
            return timeSlotCount;
        }));
    }
}
