package com.estime.room.application.dto.input;

import com.estime.room.domain.vo.RoomSession;
import com.github.f4b6a3.tsid.Tsid;

public record RoomSessionInput(
        RoomSession session
) {

    public static RoomSessionInput from(Tsid roomSession) {
        return new RoomSessionInput(RoomSession.from(roomSession));
    }
}
