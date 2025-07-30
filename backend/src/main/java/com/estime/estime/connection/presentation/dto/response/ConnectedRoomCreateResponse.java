package com.estime.estime.connection.presentation.dto.response;

import com.estime.estime.connection.application.dto.output.ConnectedRoomCreateOutput;
import com.estime.estime.connection.domain.Platform;

public record ConnectedRoomCreateResponse(
        String session,
        Platform platform
) {

    public static ConnectedRoomCreateResponse from(final ConnectedRoomCreateOutput output) {
        return new ConnectedRoomCreateResponse(output.session(), output.platform());
    }
}
