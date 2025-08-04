package com.estime.connection.application.dto.input;

import com.estime.connection.domain.Platform;
import com.estime.room.domain.participant.vote.vo.DateSlot;
import com.estime.room.domain.participant.vote.vo.DateTimeSlot;
import com.estime.room.domain.participant.vote.vo.TimeSlot;
import com.estime.room.domain.Room;
import java.util.Set;

public record ConnectedRoomCreateInput(
        String title,
        Set<DateSlot> availableDates,
        Set<TimeSlot> availableTimes,
        DateTimeSlot deadline,
        Boolean isPublic,
        Platform platform,
        String channelId
) {

    public Room toRoomEntity() {
        return Room.withoutId(title, availableDates, availableTimes, deadline, isPublic);
    }
}
