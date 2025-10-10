package com.estime.room.dto.input;

import com.estime.room.RoomSession;
import com.github.f4b6a3.tsid.Tsid;

public record RoomSessionInput(
        RoomSession session
) {

    public static RoomSessionInput from(final Tsid roomSession) {
        return new RoomSessionInput(RoomSession.from(roomSession));
    }
}
