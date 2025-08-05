package com.estime.room.application.dto.input;

import com.estime.room.domain.Room;
import com.estime.room.domain.vo.DateSlot;
import com.estime.room.domain.vo.DateTimeSlot;
import com.estime.room.domain.vo.TimeSlot;
import java.util.List;

public record RoomCreateInput(
        String title,
        List<DateSlot> availableDateSlots,
        List<TimeSlot> availableTimeSlots,
        DateTimeSlot deadline
) {

    public Room toEntity() {
        return Room.withoutId(title, availableDateSlots, availableTimeSlots, deadline);
    }
}
