package com.estime.room.application.dto.output;

import com.estime.room.domain.Room;
import com.estime.room.domain.vo.RoomSession;

public record RoomCreateOutput(
        RoomSession session
) {

    public static RoomCreateOutput from(final Room room) {
        return new RoomCreateOutput(room.getSession());
    }
}
