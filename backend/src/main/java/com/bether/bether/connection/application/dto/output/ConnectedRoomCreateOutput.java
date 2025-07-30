package com.bether.bether.connection.application.dto.output;

import com.bether.bether.connection.domain.ConnectedRoom;
import com.bether.bether.connection.domain.Platform;

public record ConnectedRoomCreateOutput(
        String session,
        Platform platform
) {

    public static ConnectedRoomCreateOutput from(final ConnectedRoom connectedRoom) {
        return new ConnectedRoomCreateOutput(connectedRoom.getRoom().getSession(), connectedRoom.getPlatform());
    }
}
