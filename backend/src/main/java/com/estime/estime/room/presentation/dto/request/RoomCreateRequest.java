package com.estime.estime.room.presentation.dto.request;

import com.estime.estime.room.application.dto.RoomCreateInput;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record RoomCreateRequest(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTime,
        LocalTime endTime,
        LocalDateTime deadLine,
        Boolean isPublic
) {

    public RoomCreateInput toInput() {
        return new RoomCreateInput(title, availableDates, startTime, endTime, deadLine, isPublic);
    }
}
