package com.estime.estime.room.application.dto;

import com.estime.estime.room.domain.Room;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record RoomCreateInput(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTime,
        LocalTime endTime,
        LocalDateTime deadLine,
        boolean isPublic
) {

    public Room toEntity() {
        return Room.withoutId(title, availableDates, startTime, endTime, deadLine, isPublic);
    }
}
