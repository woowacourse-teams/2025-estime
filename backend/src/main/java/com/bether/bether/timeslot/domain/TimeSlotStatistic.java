package com.bether.bether.timeslot.domain;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class TimeSlotStatistic {

    public static final int MAX_RECOMMENDATION_COUNT = 2;

    private final Map<LocalDateTime, TimeSlotParticipants> participantsByDateTime;

    public static TimeSlotStatistic create() {
        return new TimeSlotStatistic(new HashMap<>());
    }

    public void calculate(final List<TimeSlot> timeSlots) {
        for (final TimeSlot timeSlot : timeSlots) {
            accumulate(timeSlot);
        }
    }

    public List<TimeSlotParticipants> getStatistic() {
        return participantsByDateTime.values()
                .stream()
                .toList();
    }

    public List<TimeSlotParticipants> getRecommendation() {
        final List<TimeSlotParticipants> timeSlotParticipants = participantsByDateTime.values()
                .stream()
                .sorted(Comparator.comparingInt(TimeSlotParticipants::size).reversed())
                .toList();

        final int recommendationCount = Math.min(timeSlotParticipants.size(), MAX_RECOMMENDATION_COUNT);
        return timeSlotParticipants.subList(0, recommendationCount);
    }

    private void accumulate(final TimeSlot timeSlot) {
        final LocalDateTime dateTime = timeSlot.getStartAt();

        participantsByDateTime.putIfAbsent(dateTime, TimeSlotParticipants.from(dateTime));
        participantsByDateTime.computeIfPresent(dateTime, ((dateTimeKey, timeSlotParticipants) -> {
            timeSlotParticipants.addUserName(timeSlot.getUserName());
            return timeSlotParticipants;
        }));
    }
}
