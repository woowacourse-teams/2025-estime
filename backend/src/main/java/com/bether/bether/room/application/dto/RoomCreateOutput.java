package com.bether.bether.room.application.dto;

import com.bether.bether.room.domain.Room;
import java.util.UUID;

public record RoomCreateOutput(
        UUID session
) {

    public static RoomCreateOutput from(final Room room) {
        return new RoomCreateOutput(room.getSession());
    }
}
