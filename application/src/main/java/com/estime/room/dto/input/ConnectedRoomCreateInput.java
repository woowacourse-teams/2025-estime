package com.estime.room.dto.input;

import com.estime.room.platform.PlatformType;
import com.estime.room.platform.notification.PlatformNotification;
import com.estime.room.slot.DateTimeSlot;
import java.time.Instant;
import java.util.List;

public record ConnectedRoomCreateInput(
        String title,
        List<DateTimeSlot> slotCodes,
        Instant deadline,
        PlatformType platformType,
        String channelId,
        PlatformNotification notification
) {
}
