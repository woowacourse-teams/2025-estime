package com.bether.bether.room.application.dto;

import com.bether.bether.room.domain.Room;
import java.util.UUID;

public record RoomOutput(
        UUID session
) {

    public static RoomOutput from(final Room room) {
        return new RoomOutput(room.getSession());
    }
}
