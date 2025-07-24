package com.bether.bether.room.presentation.dto.request;

import com.bether.bether.room.application.dto.RoomCreateInput;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record RoomCreateRequest(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTimeStartAt,
        LocalTime endTimeStartAt,
        LocalDateTime deadLine,
        Boolean isPublic
) {

    public RoomCreateInput toInput() {
        return new RoomCreateInput(title, availableDates, startTimeStartAt, endTimeStartAt, deadLine, isPublic);
    }
}
