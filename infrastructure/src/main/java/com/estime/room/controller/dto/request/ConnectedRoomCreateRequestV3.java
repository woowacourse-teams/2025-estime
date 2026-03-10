package com.estime.room.controller.dto.request;

import com.estime.room.dto.input.ConnectedRoomCreateInput;
import com.estime.room.platform.PlatformType;
import com.estime.room.platform.notification.PlatformNotification;
import com.estime.room.slot.DateTimeSlot;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

public record ConnectedRoomCreateRequestV3(
        @Schema(example = "아인슈타임 알림 회의")
        String title,

        @Schema(description = "압축된 슬롯 배열 (EPOCH: 2025-10-24T00:00+09:00)", example = "[17682, 17683, 17684]")
        List<Integer> availableSlots,

        @Schema(example = "2026-01-06T00:00:00Z")
        Instant deadline,

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
                availableSlots.stream()
                        .map(DateTimeSlot::from)
                        .toList(),
                deadline,
                PlatformType.from(platformType),
                channelId,
                PlatformNotification.of(notification.created(), notification.remind(), notification.deadline())
        );
    }

    public record PlatformNotificationRequest(
            @Schema(description = "방 생성 시 알림", example = "true")
            Boolean created,

            @Schema(description = "투표 독려 알림", example = "true")
            Boolean remind,

            @Schema(description = "투표 마감 알림", example = "true")
            Boolean deadline
    ) {
    }
}
