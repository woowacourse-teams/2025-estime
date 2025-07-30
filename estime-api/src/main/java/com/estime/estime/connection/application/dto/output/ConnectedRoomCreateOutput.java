package com.estime.estime.connection.application.dto.output;

import com.estime.estime.connection.domain.ConnectedRoom;
import com.estime.estime.connection.domain.Platform;

public record ConnectedRoomCreateOutput(
        String session,
        Platform platform
) {

    public static ConnectedRoomCreateOutput from(final ConnectedRoom connectedRoom) {
        return new ConnectedRoomCreateOutput(connectedRoom.getRoom().getSession(), connectedRoom.getPlatform());
    }
}
