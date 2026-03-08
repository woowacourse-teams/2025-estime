package com.estime.room.controller.dto.request;

import com.estime.room.controller.dto.FlexibleInstantDeserializer;
import com.estime.room.dto.input.RoomCreateInput;
import com.estime.room.slot.DateTimeSlot;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
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

        @Schema(example = "2026-01-06T09:00+09:00")
        @JsonDeserialize(using = FlexibleInstantDeserializer.class)
        Instant deadline
) {

    public RoomCreateInput toInput(final ZoneId zone) {
        return new RoomCreateInput(
                title,
                toSlotCodes(availableDateSlots, availableTimeSlots, zone),
                deadline
        );
    }

    private static List<DateTimeSlot> toSlotCodes(
            final List<LocalDate> dates,
            final List<LocalTime> times,
            final ZoneId zone
    ) {
        final List<DateTimeSlot> slotCodes = new ArrayList<>();
        for (final LocalDate date : dates) {
            for (final LocalTime time : times) {
                slotCodes.add(DateTimeSlot.from(LocalDateTime.of(date, time).atZone(zone).toInstant()));
            }
        }
        return slotCodes;
    }
}
