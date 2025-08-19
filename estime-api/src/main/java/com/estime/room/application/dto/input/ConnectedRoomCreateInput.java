package com.estime.room.application.dto.input;

import com.estime.room.domain.platform.PlatformType;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.slot.vo.TimeSlot;
import java.util.List;

public record ConnectedRoomCreateInput(
        String title,
        List<DateSlot> availableDates,
        List<TimeSlot> availableTimes,
        DateTimeSlot deadline,
        PlatformType platform,
        String channelId
) {

    public RoomCreateInput toRoomCreateInput() {
        return new RoomCreateInput(title, availableDates, availableTimes, deadline);
    }
}
