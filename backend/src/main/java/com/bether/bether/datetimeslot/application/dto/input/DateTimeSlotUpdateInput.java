package com.bether.bether.datetimeslot.application.dto.input;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record DateTimeSlotUpdateInput(
        UUID roomSession,
        String userName,
        List<LocalDateTime> dateTimes
) {
}
