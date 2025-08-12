package com.estime.connection.application.dto.input;

import com.estime.connection.domain.Platform;
import com.estime.room.domain.Room;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.slot.vo.TimeSlot;
import java.util.List;

public record ConnectedRoomCreateInput(
        String title,
        List<DateSlot> availableDates,
        List<TimeSlot> availableTimes,
        DateTimeSlot deadline,
        Platform platform,
        String channelId
) {

    public Room toRoomEntity() {
        return Room.withoutId(
                title,
                availableDates,
                availableTimes,
                deadline
        );
    }
}
