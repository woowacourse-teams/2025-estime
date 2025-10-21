package com.estime.room.dto.input;

import com.estime.room.RoomSession;

public record RoomSessionInput(
        RoomSession session
) {

    public static RoomSessionInput from(final RoomSession session) {
        return new RoomSessionInput(session);
    }
}
