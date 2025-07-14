package com.bether.bether.timeslot.application.dto.output;

import java.time.LocalDateTime;
import java.util.List;

public record TimeSlotRankOutput(
        LocalDateTime dateTime,
        Integer count,
        List<String> userNames
) {
}
