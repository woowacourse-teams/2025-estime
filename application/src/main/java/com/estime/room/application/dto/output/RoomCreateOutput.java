package com.estime.room.application.dto.output;

import com.estime.domain.room.Room;
import com.estime.domain.room.RoomSession;

public record RoomCreateOutput(
        RoomSession session
) {

    public static RoomCreateOutput from(final Room room) {
        return new RoomCreateOutput(room.getSession());
    }
}
