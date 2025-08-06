package com.estime.room.presentation.dto.response;

import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.TimeSlot;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record RoomResponse(
        @Schema(example = "Estime 스터디")
        String title,

        @Schema(example = "[\"2026-01-01\", \"2026-01-02\"]")
        List<LocalDate> availableDateSlots,

        @Schema(example = "[\"09:00\", \"09:30\", \"10:00\", \"10:30\", \"11:00\", \"11:30\", \"12:00\", \"12:30\"]")
        @JsonFormat(pattern = "HH:mm")
        List<LocalTime> availableTimeSlots,

        @Schema(example = "2026-01-06T09:00")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime deadline,

        @Schema(example = "0MHMD5APPEVE1", description = "13자 문자열")
        String roomSession
) {

    public static RoomResponse from(final RoomOutput output) {
        return new RoomResponse(
                output.title(),
                output.availableDateSlots().stream().map(DateSlot::getStartAt).sorted().toList(),
                output.availableTimeSlots().stream().map(TimeSlot::getStartAt).sorted().toList(),
                output.deadline().getStartAt(),
                output.roomSession()
        );
    }
}
