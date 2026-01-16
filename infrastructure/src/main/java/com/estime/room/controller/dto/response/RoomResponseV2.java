package com.estime.room.controller.dto.response;

import com.estime.room.dto.output.RoomOutput;
import com.estime.room.slot.RoomAvailableSlot;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;

public record RoomResponseV2(
        @Schema(example = "Estime 스터디")
        String title,

        @Schema(example = "[\"2026-01-01T09:00\", \"2026-01-01T09:30\", \"2026-01-02T14:00\"]")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        List<LocalDateTime> availableDateTimeSlots,

        @Schema(example = "2026-01-06T09:00")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime deadline,

        @Schema(example = "0MHMD5APPEVE1", description = "13자 문자열")
        String roomSession
) {

    public static RoomResponseV2 from(final RoomOutput output) {
        return new RoomResponseV2(
                output.title(),
                output.availableSlots().stream()
                        .map(RoomAvailableSlot::getStartAt)
                        .sorted()
                        .toList(),
                output.deadline(),
                output.session().getValue()
        );
    }
}
