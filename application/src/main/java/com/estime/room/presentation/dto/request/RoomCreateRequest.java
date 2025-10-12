package com.estime.room.presentation.dto.request;

import com.estime.room.application.dto.input.DateSlotInput;
import com.estime.room.application.dto.input.RoomCreateInput;
import com.estime.room.application.dto.input.TimeSlotInput;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record RoomCreateRequest(
        @Schema(example = "아인슈타임 회의")
        String title,

        @Schema(example = "[\"2026-01-01\", \"2026-01-02\"]")
        @JsonFormat(pattern = "yyyy-MM-dd")
        List<LocalDate> availableDateSlots,

        @Schema(example = "[\"09:00\", \"09:30\", \"10:00\", \"10:30\", \"11:00\", \"11:30\", \"12:00\", \"12:30\"]")
        @JsonFormat(pattern = "HH:mm")
        List<LocalTime> availableTimeSlots,

        @Schema(example = "2026-01-06T09:00")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime deadline
) {

    public RoomCreateInput toInput() {
        return new RoomCreateInput(
                title,
                availableDateSlots.stream().map(DateSlotInput::new).toList(),
                availableTimeSlots.stream().map(TimeSlotInput::new).toList(),
                deadline
        );
    }
}
