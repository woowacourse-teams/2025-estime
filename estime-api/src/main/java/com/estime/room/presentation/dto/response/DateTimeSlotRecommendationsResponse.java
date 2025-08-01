package com.estime.room.presentation.dto.response;

import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotRecommendations;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record DateTimeSlotRecommendationsResponse(
        List<DateTimeSlotRecommendationResponse> recommendations
) {

    public static DateTimeSlotRecommendationsResponse from(final DateTimeSlotRecommendations output) {
        final List<DateTimeSlotRecommendationResponse> recommendations = output.recommendations()
                .stream()
                .map(rankOutput -> new DateTimeSlotRecommendationResponse(
                        rankOutput.dateTime(),
                        rankOutput.userNames()
                ))
                .toList();
        return new DateTimeSlotRecommendationsResponse(recommendations);
    }

    private record DateTimeSlotRecommendationResponse(
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
            LocalDateTime dateTime,

            List<String> userNames
    ) {
    }
}
