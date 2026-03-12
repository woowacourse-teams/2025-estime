package com.estime.room.controller.dto.request;

import com.estime.room.controller.dto.FlexibleInstantDeserializer;
import com.estime.room.dto.input.RoomCreateInput;
import com.estime.room.slot.DateTimeSlot;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

public record RoomCreateRequestV2(
        @Schema(example = "아인슈타임 회의")
        String title,

        @Schema(example = "[\"2026-01-01T09:00+09:00\", \"2026-01-01T09:30+09:00\", \"2026-01-02T14:00+09:00\"]")
        @JsonDeserialize(contentUsing = FlexibleInstantDeserializer.class)
        List<Instant> availableDateTimeSlots,

        @Schema(example = "2026-01-06T09:00+09:00")
        @JsonDeserialize(using = FlexibleInstantDeserializer.class)
        Instant deadline
) {

    public RoomCreateInput toInput() {
        return new RoomCreateInput(
                title,
                availableDateTimeSlots.stream()
                        .map(DateTimeSlot::from)
                        .toList(),
                deadline
        );
    }
}
