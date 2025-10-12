package com.estime.room.application.dto.output;

import com.estime.room.Room;
import com.estime.room.RoomSession;
import com.estime.room.slot.DateSlot;
import com.estime.room.slot.TimeSlot;
import java.time.LocalDateTime;
import java.util.List;

public record RoomOutput(
        String title,
        List<DateSlot> availableDateSlots,
        List<TimeSlot> availableTimeSlots,
        LocalDateTime deadline,
        RoomSession session
) {

    public static RoomOutput of(final Room room, final List<DateSlot> dateSlots, final List<TimeSlot> timeSlots) {
        return new RoomOutput(
                room.getTitle(),
                dateSlots,
                timeSlots,
                room.getDeadline(),
                room.getSession()
        );
    }
}
