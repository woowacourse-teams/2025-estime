package com.estime.estime.room.presentation.dto.response;

import com.estime.estime.room.application.dto.RoomOutput;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record RoomResponse(
        String title,

        List<LocalDate> availableDates,

        @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,

        @JsonFormat(pattern = "HH:mm")
        LocalTime endTime,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
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
                output.roomSession()
        );
    }
}
