package com.estime.room.dto.input;

import com.estime.room.Room;
import com.estime.room.slot.DateSlot;
import com.estime.room.slot.TimeSlot;
import java.time.LocalDateTime;
import java.util.List;

public record RoomCreateInput(
        String title,
        List<DateSlot> availableDateSlots,
        List<TimeSlot> availableTimeSlots,
        LocalDateTime deadline
) {

    public Room toEntity() {
        return Room.withoutId(title, availableDateSlots, availableTimeSlots, deadline);
    }
}
