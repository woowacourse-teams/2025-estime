package com.estime.room.controller.dto.request;

import com.estime.room.dto.input.RoomCreateInput;
import com.estime.room.slot.DateTimeSlot;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

public record RoomCreateRequestV3(
        @Schema(example = "아인슈타임 회의")
        String title,

        @Schema(description = "압축된 슬롯 배열 (EPOCH: 2025-10-24T00:00+09:00)", example = "[17682, 17683, 17684]")
        List<Integer> availableSlots,

        @Schema(example = "2026-01-06T00:00:00Z")
        Instant deadline
) {

    public RoomCreateInput toInput() {
        return new RoomCreateInput(
                title,
                availableSlots.stream()
                        .map(DateTimeSlot::from)
                        .toList(),
                deadline
        );
    }
}
