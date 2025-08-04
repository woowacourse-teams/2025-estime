package com.estime.room.application.dto.input;

import com.estime.room.domain.participant.vote.vo.DateSlot;
import com.estime.room.domain.participant.vote.vo.DateTimeSlot;
import com.estime.room.domain.participant.vote.vo.TimeSlot;
import com.estime.room.domain.Room;
import java.util.Set;

public record RoomCreateInput(
        String title,
        Set<DateSlot> availableDateSlots,
        Set<TimeSlot> availableTimeSlots,
        DateTimeSlot deadline,
        boolean isPublic
) {

    public Room toEntity() {
        return Room.withoutId(title, availableDateSlots, availableTimeSlots, deadline, isPublic);
    }
}
