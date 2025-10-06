package com.estime.room.application.dto.input;

import com.estime.room.platform.PlatformNotification;
import com.estime.room.platform.PlatformType;
import com.estime.room.slot.DateSlot;
import com.estime.room.slot.TimeSlot;
import java.time.LocalDateTime;
import java.util.List;

public record ConnectedRoomCreateInput(
        String title,
        List<DateSlot> availableDateSlots,
        List<TimeSlot> availableTimeSlots,
        LocalDateTime deadline,
        PlatformType type,
        String channelId,
        PlatformNotification notification
) {

    public RoomCreateInput toRoomCreateInput() {
        return new RoomCreateInput(title, availableDateSlots, availableTimeSlots, deadline);
    }
}
