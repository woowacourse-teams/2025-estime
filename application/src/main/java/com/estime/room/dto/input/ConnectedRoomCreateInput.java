package com.estime.room.dto.input;

import com.estime.room.platform.PlatformType;
import com.estime.room.platform.notification.PlatformNotification;
import com.estime.room.slot.CompactDateTimeSlot;
import java.time.LocalDateTime;
import java.util.List;

public record ConnectedRoomCreateInput(
        String title,
        List<CompactDateTimeSlot> slotCodes,
        LocalDateTime deadline,
        PlatformType platformType,
        String channelId,
        PlatformNotification notification
) {
}
