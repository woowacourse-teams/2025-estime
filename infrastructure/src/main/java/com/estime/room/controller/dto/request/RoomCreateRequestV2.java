package com.estime.room.controller.dto.request;

import com.estime.room.dto.input.RoomCreateInput;
import com.estime.room.slot.CompactDateTimeSlot;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;

public record RoomCreateRequestV2(
        @Schema(example = "아인슈타임 회의")
        String title,

        @Schema(example = "[\"2026-01-01T09:00\", \"2026-01-01T09:30\", \"2026-01-02T14:00\"]")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        List<LocalDateTime> availableDateTimeSlots,

        @Schema(example = "2026-01-06T09:00")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime deadline
) {

    public RoomCreateInput toInput() {
        return new RoomCreateInput(
                title,
                availableDateTimeSlots.stream()
                        .map(CompactDateTimeSlot::from)
                        .toList(),
                deadline
        );
    }
}
