package com.bether.bether.timeslot.application.dto.output;

import com.bether.bether.timeslot.domain.TimeSlotStatistic;
import java.util.List;

public record TimeSlotRecommendationsOutput(
        List<TimeSlotRecommendationOutput> recommendations
) {

    public static TimeSlotRecommendationsOutput from(final TimeSlotStatistic timeSlotStatistic) {
        return new TimeSlotRecommendationsOutput(
                timeSlotStatistic.getRecommendation()
                        .stream()
                        .map(timeSlotParticipants -> new TimeSlotRecommendationOutput(
                                timeSlotParticipants.getDateTime(),
                                timeSlotParticipants.getUserNames()
                        ))
                        .toList()
        );
    }
}
