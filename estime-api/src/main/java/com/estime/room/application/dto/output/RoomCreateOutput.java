package com.estime.room.application.dto.output;

import com.estime.room.domain.Room;

public record RoomCreateOutput(
        String session
) {

    public static RoomCreateOutput from(final Room room) {
        return new RoomCreateOutput(room.getSession());
    }
}
