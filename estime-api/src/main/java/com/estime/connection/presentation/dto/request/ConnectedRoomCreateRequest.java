package com.estime.connection.presentation.dto.request;

import com.estime.connection.application.dto.input.ConnectedRoomCreateInput;
import com.estime.connection.domain.Platform;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.slot.vo.TimeSlot;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record ConnectedRoomCreateRequest(
        @Schema(example = "아인슈타임 알림 회의")
        String title,

        @Schema(example = "[\"2026-01-01\", \"2026-01-02\"]")
        List<LocalDate> availableDateSlots,

        @Schema(example = "[\"09:00\", \"09:30\", \"10:00\", \"10:30\", \"11:00\", \"11:30\", \"12:00\", \"12:30\"]")
        List<LocalTime> availableTimeSlots,

        @Schema(example = "2026-01-06T09:00")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime deadline,

        @Schema(example = "DISCORD", description = "알림 대상 플랫폼 이름")
        Platform platform,

        @Schema(example = "1393585306225348700", description = "대상 채널 ID")
        String channelId
) {

    public ConnectedRoomCreateInput toInput() {
        return new ConnectedRoomCreateInput(
                title,
                availableDateSlots.stream().map(DateSlot::from).toList(),
                availableTimeSlots.stream().map(TimeSlot::from).toList(),
                DateTimeSlot.from(deadline),
                platform,
                channelId
        );
    }
}
