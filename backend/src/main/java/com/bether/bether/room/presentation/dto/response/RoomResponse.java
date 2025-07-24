package com.bether.bether.room.presentation.dto.response;

import com.bether.bether.room.application.dto.RoomOutput;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record RoomResponse(
        String title,

        List<LocalDate> availableDates,

        @JsonFormat(pattern = "HH:mm")
        LocalTime startTimeStartAt,

        @JsonFormat(pattern = "HH:mm")
        LocalTime endTimeStartAt,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime deadLine,

        Boolean isPublic,

        String roomSession
) {

    public static RoomResponse from(final RoomOutput output) {
        return new RoomResponse(
                output.title(),
                output.availableDates(),
                output.startTimeStartAt(),
                output.endTimeStartAt(),
                output.deadLine(),
                output.isPublic(),
                output.roomSession().toString()
        );
    }
}
