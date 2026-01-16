package com.estime.room.dto.input;

import com.estime.room.slot.CompactDateTimeSlot;
import java.time.LocalDateTime;
import java.util.List;

public record RoomCreateInput(
        String title,
        List<CompactDateTimeSlot> slotCodes,
        LocalDateTime deadline
) {
}
