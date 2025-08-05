package com.estime.room.application.dto.output;

import com.estime.room.domain.Room;
import com.estime.room.domain.vo.DateSlot;
import com.estime.room.domain.vo.DateTimeSlot;
import com.estime.room.domain.vo.TimeSlot;
import java.util.List;

public record RoomOutput(
        String title,
        List<DateSlot> availableDateSlots,
        List<TimeSlot> availableTimeSlots,
        DateTimeSlot deadline,
        String roomSession
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
