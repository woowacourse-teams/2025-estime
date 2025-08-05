package com.estime.connection.application.dto.output;

import com.estime.connection.domain.ConnectedRoom;
import com.estime.connection.domain.Platform;

public record ConnectedRoomCreateOutput(
        String session,
        Platform platform
) {

    public static ConnectedRoomCreateOutput from(final ConnectedRoom connectedRoom) {
        return new ConnectedRoomCreateOutput(connectedRoom.getRoom().getSession(), connectedRoom.getPlatform());
    }
}
