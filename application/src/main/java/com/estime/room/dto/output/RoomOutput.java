package com.estime.room.dto.output;

import com.estime.room.Room;
import com.estime.room.slot.DateSlot;
import com.estime.room.slot.TimeSlot;
import com.estime.room.RoomSession;
import java.time.LocalDateTime;
import java.util.List;

public record RoomOutput(
        String title,
        List<DateSlot> availableDateSlots,
        List<TimeSlot> availableTimeSlots,
        LocalDateTime deadline,
        RoomSession session
) {

    public static RoomOutput from(final Room room) {
        return new RoomOutput(
                room.getTitle(),
                room.getAvailableDateSlots().stream().toList(),
                room.getAvailableTimeSlots().stream().toList(),
                room.getDeadline(),
                room.getSession()
        );
    }
}
