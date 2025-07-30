package com.estime.estime.datetimeslot.application.dto.input;

import java.time.LocalDateTime;
import java.util.List;

public record DateTimeSlotUpdateInput(
        String roomSession,
        String userName,
        List<LocalDateTime> dateTimes
) {
}
