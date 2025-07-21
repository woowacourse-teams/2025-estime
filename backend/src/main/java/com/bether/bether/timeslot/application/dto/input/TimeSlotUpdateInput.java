package com.bether.bether.timeslot.application.dto.input;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TimeSlotUpdateInput(
        UUID roomSession,
        String userName,
        List<LocalDateTime> dateTimes
) {
}
