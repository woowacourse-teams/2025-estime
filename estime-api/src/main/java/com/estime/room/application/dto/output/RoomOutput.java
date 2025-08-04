package com.estime.room.application.dto.output;

import com.estime.room.domain.participant.vote.vo.DateSlot;
import com.estime.room.domain.participant.vote.vo.DateTimeSlot;
import com.estime.room.domain.participant.vote.vo.TimeSlot;
import com.estime.room.domain.Room;
import java.util.Set;

public record RoomOutput(
        String title,
        Set<DateSlot> availableDateSlots,
        Set<TimeSlot> availableTimeSlots,
        DateTimeSlot deadline,
        boolean isPublic,
        String roomSession
) {

    public static RoomOutput from(final Room room) {
        return new RoomOutput(
                room.getTitle(),
                room.getAvailableDateSlots(),
                room.getAvailableTimeSlots(),
                room.getDeadline(),
                room.isPublic(),
                room.getSession()
        );
    }
}
