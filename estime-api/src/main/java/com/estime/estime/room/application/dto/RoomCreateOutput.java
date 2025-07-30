package com.estime.estime.room.application.dto;

import com.estime.estime.room.domain.Room;

public record RoomCreateOutput(
        String session
) {

    public static RoomCreateOutput from(final Room room) {
        return new RoomCreateOutput(room.getSession());
    }
}
