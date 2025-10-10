package com.estime.room.dto.output;

import com.estime.room.platform.PlatformType;
import com.estime.room.RoomSession;

public record ConnectedRoomCreateOutput(
        RoomSession session,
        PlatformType type
) {

    public static ConnectedRoomCreateOutput from(final RoomSession session, final PlatformType type) {
        return new ConnectedRoomCreateOutput(session, type);
    }
}
