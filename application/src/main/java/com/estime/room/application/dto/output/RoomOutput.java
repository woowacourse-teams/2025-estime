package com.estime.room.application.dto.output;

import com.estime.domain.room.Room;
import com.estime.domain.room.timeslot.DateSlot;
import com.estime.domain.room.timeslot.TimeSlot;
import com.estime.domain.room.RoomSession;
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
