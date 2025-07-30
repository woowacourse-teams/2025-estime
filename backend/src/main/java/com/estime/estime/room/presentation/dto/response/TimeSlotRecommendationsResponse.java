package com.estime.estime.room.presentation.dto.response;

import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotRecommendationsOutput;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record TimeSlotRecommendationsResponse(
        List<TimeSlotRecommendationResponse> recommendations
) {

    public static TimeSlotRecommendationsResponse from(final DateTimeSlotRecommendationsOutput output) {
        final List<TimeSlotRecommendationResponse> recommendations = output.recommendations()
                .stream()
                .map(rankOutput -> new TimeSlotRecommendationResponse(
                        rankOutput.dateTime(),
                        rankOutput.userNames()
                ))
                .toList();
        return new TimeSlotRecommendationsResponse(recommendations);
    }

    private record TimeSlotRecommendationResponse(
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
            LocalDateTime dateTime,

            List<String> userNames
    ) {
    }
}
