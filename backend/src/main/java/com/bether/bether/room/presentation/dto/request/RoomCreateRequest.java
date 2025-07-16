package com.bether.bether.room.presentation.dto.request;

import com.bether.bether.room.application.dto.RoomInput;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record RoomCreateRequest(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTime,
        LocalTime endTime
) {

    public RoomInput toInput() {
        return new RoomInput(title, availableDates, startTime, endTime);
    }
}
