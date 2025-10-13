package com.estime.room.application.dto.output;

import com.estime.room.Room;
import com.estime.room.RoomSession;
import com.estime.room.slot.AvailableDateSlot;
import com.estime.room.slot.AvailableTimeSlot;
import java.time.LocalDateTime;
import java.util.List;

public record RoomOutput(
        String title,
        List<AvailableDateSlot> availableDateSlots,
        List<AvailableTimeSlot> availableTimeSlots,
        LocalDateTime deadline,
        RoomSession session
) {

    public static RoomOutput of(final Room room, final List<AvailableDateSlot> availableDateSlots,
                                final List<AvailableTimeSlot> availableTimeSlots) {
        return new RoomOutput(
                room.getTitle(),
                availableDateSlots,
                availableTimeSlots,
                room.getDeadline(),
                room.getSession()
        );
    }
}
