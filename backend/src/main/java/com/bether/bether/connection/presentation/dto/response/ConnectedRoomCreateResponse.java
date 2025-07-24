package com.bether.bether.connection.presentation.dto.response;

import com.bether.bether.connection.application.dto.output.ConnectedRoomCreateOutput;
import com.bether.bether.connection.domain.Platform;
import java.util.UUID;

public record ConnectedRoomCreateResponse(
        UUID session,
        Platform platform
) {

    public static ConnectedRoomCreateResponse from(final ConnectedRoomCreateOutput output) {
        return new ConnectedRoomCreateResponse(output.session(), output.platform());
    }
}
