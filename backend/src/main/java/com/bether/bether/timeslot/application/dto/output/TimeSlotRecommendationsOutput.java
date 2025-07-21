package com.bether.bether.timeslot.application.dto.output;

import com.bether.bether.timeslot.domain.TimeSlotParticipants;
import java.util.List;

public record TimeSlotRecommendationsOutput(
        List<TimeSlotRecommendationOutput> recommendations
) {

    public static TimeSlotRecommendationsOutput from(final List<TimeSlotParticipants> timeSlotParticipants) {
        return new TimeSlotRecommendationsOutput(
                timeSlotParticipants.stream()
                        .map(timeSlotParticipant -> new TimeSlotRecommendationOutput(
                                timeSlotParticipant.getDateTime(),
                                timeSlotParticipant.getUserNames()
                        ))
                        .toList()
        );
    }
}
