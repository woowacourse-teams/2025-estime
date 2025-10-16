package com.estime.room.dto.input;

import com.estime.room.RoomSession;

public record RoomSessionInput(
        RoomSession session
) {

    public static RoomSessionInput from(final String roomSession) {
        return new RoomSessionInput(RoomSession.from(roomSession));
    }
}
