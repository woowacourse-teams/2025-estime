package com.estime.room.dto.output;

import com.estime.room.Room;
import com.estime.room.RoomSession;
import com.estime.room.slot.RoomAvailableSlot;
import java.time.LocalDateTime;
import java.util.List;

public record RoomOutput(
        String title,
        List<RoomAvailableSlot> availableSlots,
        LocalDateTime deadline,
        RoomSession session
) {

    public static RoomOutput from(final Room room) {
        return new RoomOutput(
                room.getTitle(),
                room.getRoomAvailableSlots(),
                room.getDeadline(),
                room.getSession()
        );
    }
}