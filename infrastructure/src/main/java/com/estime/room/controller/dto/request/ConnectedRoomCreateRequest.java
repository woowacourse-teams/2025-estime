package com.estime.room.controller.dto.request;

import com.estime.room.dto.input.ConnectedRoomCreateInput;
import com.estime.room.dto.input.DateSlotInput;
import com.estime.room.dto.input.TimeSlotInput;
import com.estime.room.platform.PlatformNotification;
import com.estime.room.platform.PlatformType;
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
        String platformType,

        @Schema(example = "1393585306225348700", description = "대상 채널 ID")
        String channelId,

        @Schema(description = "알림 설정", example = "{\"created\":true,\"remind\":true,\"deadline\":true}")
        PlatformNotificationRequest notification
) {

    public ConnectedRoomCreateInput toInput() {
        return new ConnectedRoomCreateInput(
                title,
                availableDateSlots.stream().map(DateSlotInput::new).toList(),
                availableTimeSlots.stream().map(TimeSlotInput::new).toList(),
                deadline,
                PlatformType.from(platformType),
                channelId,
                PlatformNotification.of(notification.created, notification.remind, notification.deadline)
        );
    }

    public record PlatformNotificationRequest(
            // TODO  Boolean -> null 입력시 NPE 유도, 추후에 모든 controller req -> spring validation
            @Schema(description = "방 생성 시 알림", example = "true")
            Boolean created,

            @Schema(description = "투표 독려 알림", example = "true")
            Boolean remind,

            @Schema(description = "투표 마감 알림", example = "true")
            Boolean deadline
    ) {
    }
}
