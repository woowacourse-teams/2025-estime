package com.estime.room.application.dto.input;

import com.estime.domain.room.platform.PlatformNotification;
import com.estime.domain.room.platform.PlatformType;
import com.estime.domain.room.timeslot.DateSlot;
import com.estime.domain.room.timeslot.TimeSlot;
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
