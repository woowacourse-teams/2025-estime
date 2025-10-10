package com.estime.room.dto.output;

import com.estime.room.Room;
import com.estime.room.RoomSession;

public record RoomCreateOutput(
        RoomSession session
) {

    public static RoomCreateOutput from(final Room room) {
        return new RoomCreateOutput(room.getSession());
    }
}
