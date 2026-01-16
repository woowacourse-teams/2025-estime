package com.estime.room.controller.dto.request;

import com.estime.room.dto.input.RoomCreateInput;
import com.estime.room.slot.CompactDateTimeSlot;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
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
                toSlotCodes(availableDateSlots, availableTimeSlots),
                deadline
        );
    }

    private List<CompactDateTimeSlot> toSlotCodes(
            final List<LocalDate> dates,
            final List<LocalTime> times
    ) {
        final List<CompactDateTimeSlot> slotCodes = new ArrayList<>();
        for (final LocalDate date : dates) {
            for (final LocalTime time : times) {
                slotCodes.add(CompactDateTimeSlot.from(LocalDateTime.of(date, time)));
            }
        }
        return slotCodes;
    }
}
