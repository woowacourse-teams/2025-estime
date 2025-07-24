package com.bether.bether.datetimeslot.application.dto.output;

import com.bether.bether.datetimeslot.domain.DateTimeSlotParticipants;
import java.util.List;

public record DateTimeSlotRecommendationsOutput(
        List<DateTimeSlotRecommendationOutput> recommendations
) {

    public static DateTimeSlotRecommendationsOutput from(
            final List<DateTimeSlotParticipants> dateTimeSlotParticipants) {
        return new DateTimeSlotRecommendationsOutput(
                dateTimeSlotParticipants.stream()
                        .map(timeSlotParticipant -> new DateTimeSlotRecommendationOutput(
                                timeSlotParticipant.getDateTime(),
                                timeSlotParticipant.getUserNames()
                        ))
                        .toList()
        );
    }
}
