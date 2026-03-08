package com.estime.room.controller.dto.request;

import com.estime.room.controller.dto.FlexibleInstantDeserializer;
import com.estime.room.dto.input.ConnectedRoomCreateInput;
import com.estime.room.platform.PlatformType;
import com.estime.room.platform.notification.PlatformNotification;
import com.estime.room.slot.DateTimeSlot;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

public record ConnectedRoomCreateRequest(
        @Schema(example = "아인슈타임 알림 회의")
        String title,

        @Schema(example = "[\"2026-01-01\", \"2026-01-02\"]")
        List<LocalDate> availableDateSlots,

        @Schema(example = "[\"09:00\", \"09:30\", \"10:00\", \"10:30\", \"11:00\", \"11:30\", \"12:00\", \"12:30\"]")
        List<LocalTime> availableTimeSlots,

        @Schema(example = "2026-01-06T09:00+09:00")
        @JsonDeserialize(using = FlexibleInstantDeserializer.class)
        Instant deadline,

        @Schema(example = "DISCORD", description = "알림 대상 플랫폼 이름")
        String platformType,

        @Schema(example = "1393585306225348700", description = "대상 채널 ID")
        String channelId,

        @Schema(description = "알림 설정", example = "{\"created\":true,\"remind\":true,\"deadline\":true}")
        PlatformNotificationRequest notification
) {

    public ConnectedRoomCreateInput toInput(final ZoneId zone) {
        return new ConnectedRoomCreateInput(
                title,
                toSlotCodes(availableDateSlots, availableTimeSlots, zone),
                deadline,
                PlatformType.from(platformType),
                channelId,
                PlatformNotification.of(notification.created, notification.remind, notification.deadline)
        );
    }

    private List<DateTimeSlot> toSlotCodes(
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
