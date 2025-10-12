package com.estime.room.application.dto.input;

import java.time.LocalDateTime;
import java.util.List;

public record RoomCreateInput(
        String title,
        List<DateSlotInput> availableDateSlots,
        List<TimeSlotInput> availableTimeSlots,
        LocalDateTime deadline
) {
}
