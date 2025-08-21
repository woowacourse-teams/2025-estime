package com.estime.room.application.dto.input;

import com.estime.room.domain.platform.PlatformNotification;
import com.estime.room.domain.platform.PlatformType;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.TimeSlot;
import java.time.LocalDateTime;
import java.util.List;

public record ConnectedRoomCreateInput(
        String title,
        List<DateSlot> availableDates,
        List<TimeSlot> availableTimes,
        LocalDateTime deadline,
        PlatformType type,
        String channelId,
        PlatformNotification notification
) {

    public RoomCreateInput toRoomCreateInput() {
        return new RoomCreateInput(title, availableDates, availableTimes, deadline);
    }
}
