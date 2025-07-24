package com.bether.bether.connection.application.dto.input;

import com.bether.bether.connection.domain.Platform;
import com.bether.bether.room.domain.Room;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record ConnectedRoomCreateInput(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTime,
        LocalTime endTime,
        LocalDateTime deadLine,
        Boolean isPublic,
        Platform platform,
        String channelId
) {

    public Room toRoomEntity() {
        return Room.withoutId(title, availableDates, startTime, endTime, deadLine, isPublic);
    }
}
