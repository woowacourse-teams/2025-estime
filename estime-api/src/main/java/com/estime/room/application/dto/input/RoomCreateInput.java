package com.estime.room.application.dto.input;

import com.estime.datetimeslot.DateSlot;
import com.estime.datetimeslot.DateTimeSlot;
import com.estime.datetimeslot.TimeSlot;
import com.estime.room.domain.Room;
import java.util.Set;

public record RoomCreateInput(
        String title,
        Set<DateSlot> availableDateSlots,
        Set<TimeSlot> availableTimeSlots,
        DateTimeSlot deadLine,
        boolean isPublic
) {

    public Room toEntity() {
        return Room.withoutId(title, availableDateSlots, availableTimeSlots, deadLine, isPublic);
    }
}
