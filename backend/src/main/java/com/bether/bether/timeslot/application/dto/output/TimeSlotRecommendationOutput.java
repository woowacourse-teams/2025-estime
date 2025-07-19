package com.bether.bether.timeslot.application.dto.output;

import java.time.LocalDateTime;
import java.util.List;

public record TimeSlotRecommendationOutput(
        LocalDateTime dateTime,
        List<String> userNames
) {
}
