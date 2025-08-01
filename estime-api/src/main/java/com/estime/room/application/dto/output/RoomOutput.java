package com.estime.room.application.dto.output;

import com.estime.datetimeslot.DateSlot;
import com.estime.datetimeslot.DateTimeSlot;
import com.estime.datetimeslot.TimeSlot;
import com.estime.room.domain.Room;
import java.util.Set;

public record RoomOutput(
        String title,
        Set<DateSlot> availableDateSlots,
        Set<TimeSlot> availableTimeSlots,
        DateTimeSlot deadLine,
        boolean isPublic,
        String roomSession
) {

    public static RoomOutput from(final Room room) {
        return new RoomOutput(
                room.getTitle(),
                room.getAvailableDateSlots(),
                room.getAvailableTimeSlots(),
                room.getDeadLine(),
                room.isPublic(),
                room.getSession()
        );
    }
}
