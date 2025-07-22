package com.bether.bether.timeslot.domain;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class TimeSlotStatistic {

    private static final int MAX_RECOMMENDATION_COUNT = 2;

    private final Map<LocalDateTime, TimeSlotParticipants> participantsByDateTime;

    public static TimeSlotStatistic from(final Map<LocalDateTime, TimeSlotParticipants> participantsByDateTime) {
        if (participantsByDateTime == null) {
            throw new IllegalArgumentException("Participants by date time cannot be null");
        }
        return new TimeSlotStatistic(participantsByDateTime);
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
}
