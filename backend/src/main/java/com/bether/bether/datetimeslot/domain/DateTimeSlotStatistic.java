package com.bether.bether.datetimeslot.domain;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DateTimeSlotStatistic {

    private static final int MAX_RECOMMENDATION_COUNT = 2;

    private final Map<LocalDateTime, DateTimeSlotParticipants> participantsByDateTime;

    public static DateTimeSlotStatistic from(
            final Map<LocalDateTime, DateTimeSlotParticipants> participantsByDateTime) {
        if (participantsByDateTime == null) {
            throw new IllegalArgumentException("Participants by date time cannot be null");
        }
        return new DateTimeSlotStatistic(participantsByDateTime);
    }

    public List<DateTimeSlotParticipants> getStatistic() {
        return participantsByDateTime.values()
                .stream()
                .toList();
    }

    public List<DateTimeSlotParticipants> getRecommendation() {
        final List<DateTimeSlotParticipants> dateTimeSlotParticipants = participantsByDateTime.values()
                .stream()
                .sorted(Comparator.comparingInt(DateTimeSlotParticipants::size).reversed())
                .toList();

        final int recommendationCount = Math.min(dateTimeSlotParticipants.size(), MAX_RECOMMENDATION_COUNT);
        return dateTimeSlotParticipants.subList(0, recommendationCount);
    }
}
