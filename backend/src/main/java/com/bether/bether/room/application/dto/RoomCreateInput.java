package com.bether.bether.room.application.dto;

import com.bether.bether.room.domain.Room;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record RoomCreateInput(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTimeStartAt,
        LocalTime endTimeStartAt,
        LocalDateTime deadLine,
        boolean isPublic
) {

    public Room toEntity() {
        return Room.withoutId(title, availableDates, startTimeStartAt, endTimeStartAt, deadLine, isPublic);
    }
}
