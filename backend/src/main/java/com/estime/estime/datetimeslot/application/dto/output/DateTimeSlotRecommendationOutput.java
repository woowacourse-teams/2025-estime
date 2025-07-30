package com.estime.estime.datetimeslot.application.dto.output;

import java.time.LocalDateTime;
import java.util.List;

public record DateTimeSlotRecommendationOutput(
        LocalDateTime dateTime,
        List<String> userNames
) {
}
