package com.bether.bether.room.application.dto;

import com.bether.bether.room.domain.Room;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record RoomInput(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTime,
        LocalTime endTime
) {

    public Room toEntity() {
        return Room.withoutId(title, availableDates, startTime, endTime);
    }
}
