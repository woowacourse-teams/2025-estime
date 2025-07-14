package com.bether.bether.timeslot.domain;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TotalTimeSlotCount {

    private final Map<LocalDateTime, TimeSlotCount> dateTimeCount;

    private TotalTimeSlotCount(final Map<LocalDateTime, TimeSlotCount> dateTimeCount) {
        this.dateTimeCount = dateTimeCount;
    }

    public static TotalTimeSlotCount create() {
        return new TotalTimeSlotCount(new HashMap<>());
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

        dateTimeCount.putIfAbsent(dateTime, TimeSlotCount.from(dateTime));
        dateTimeCount.computeIfPresent(dateTime, ((dateTimeKey, timeSlotCount) -> {
            timeSlotCount.addUserName(userName);
            return timeSlotCount;
        }));
    }
}
