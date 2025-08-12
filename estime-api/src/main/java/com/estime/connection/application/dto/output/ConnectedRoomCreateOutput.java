package com.estime.connection.application.dto.output;

import com.estime.connection.domain.ConnectedRoom;
import com.estime.connection.domain.Platform;
import com.estime.room.domain.vo.RoomSession;

public record ConnectedRoomCreateOutput(
        RoomSession session,
        Platform platform
) {

    public static ConnectedRoomCreateOutput from(final ConnectedRoom connectedRoom) {
        return new ConnectedRoomCreateOutput(connectedRoom.getRoom().getSession(), connectedRoom.getPlatform());
    }
}
