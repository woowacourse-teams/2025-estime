package com.estime.room.dto.input;

import com.estime.room.slot.DateTimeSlot;
import java.time.LocalDateTime;
import java.util.List;

public record RoomCreateInput(
        String title,
        List<DateTimeSlot> slotCodes,
        LocalDateTime deadline
) {
}
