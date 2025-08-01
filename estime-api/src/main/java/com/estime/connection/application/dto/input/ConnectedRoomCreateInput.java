package com.estime.connection.application.dto.input;

import com.estime.connection.domain.Platform;
import com.estime.datetimeslot.DateSlot;
import com.estime.datetimeslot.DateTimeSlot;
import com.estime.datetimeslot.TimeSlot;
import com.estime.room.domain.Room;
import java.util.Set;

public record ConnectedRoomCreateInput(
        String title,
        Set<DateSlot> availableDates,
        Set<TimeSlot> availableTimes,
        DateTimeSlot deadLine,
        Boolean isPublic,
        Platform platform,
        String channelId
) {

    public Room toRoomEntity() {
        return Room.withoutId(title, availableDates, availableTimes, deadLine, isPublic);
    }
}
