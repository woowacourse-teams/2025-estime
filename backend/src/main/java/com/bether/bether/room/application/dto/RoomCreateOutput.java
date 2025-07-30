package com.bether.bether.room.application.dto;

import com.bether.bether.room.domain.Room;

public record RoomCreateOutput(
        String session
) {

    public static RoomCreateOutput from(final Room room) {
        return new RoomCreateOutput(room.getSession());
    }
}
