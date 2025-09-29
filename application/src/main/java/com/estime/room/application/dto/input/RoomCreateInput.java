package com.estime.room.application.dto.input;

import com.estime.domain.room.Room;
import com.estime.domain.room.timeslot.DateSlot;
import com.estime.domain.room.timeslot.TimeSlot;
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
