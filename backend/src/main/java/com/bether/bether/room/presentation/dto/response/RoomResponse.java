package com.bether.bether.room.presentation.dto.response;

import com.bether.bether.room.application.dto.RoomOutput;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record RoomResponse(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTime,
        LocalTime endTime,
        LocalDateTime deadLine,
        Boolean isPublic,
        String roomSession
) {

    public static RoomResponse from(final RoomOutput output) {
        return new RoomResponse(
                output.title(),
                output.availableDates(),
                output.startTime(),
                output.endTime(),
                output.deadLine(),
                output.isPublic(),
                output.roomSession().toString()
        );
    }
}
