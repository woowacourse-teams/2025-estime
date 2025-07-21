package com.bether.bether.room.application.dto;

import com.bether.bether.room.domain.Room;
import java.util.UUID;

public record RoomCreatedOutput(
        UUID session
) {

    public static RoomCreatedOutput from(final Room room) {
        return new RoomCreatedOutput(room.getSession());
    }
}
