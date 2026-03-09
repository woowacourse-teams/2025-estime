package com.estime.room.controller.dto.response;

import com.estime.room.dto.output.RoomOutput;
import com.estime.room.slot.RoomAvailableSlot;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

public record RoomResponseV3(
        @Schema(example = "Estime 스터디")
        String title,

        @Schema(description = "압축된 슬롯 배열 (EPOCH: 2025-10-24T00:00+09:00)", example = "[17682, 17683, 17684]")
        List<Integer> availableSlots,

        @Schema(example = "2026-01-05T00:00:00Z")
        Instant deadline,

        @Schema(example = "0MHMD5APPEVE1", description = "13자 문자열")
        String roomSession
) {

    public static RoomResponseV3 from(final RoomOutput output) {
        return new RoomResponseV3(
                output.title(),
                output.availableSlots().stream()
                        .map(slot -> slot.getSlot().getEncoded())
                        .sorted()
                        .toList(),
                output.deadline(),
                output.session().getValue()
        );
    }
}
