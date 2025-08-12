package com.estime.connection.presentation.dto.response;

import com.estime.connection.application.dto.output.ConnectedRoomCreateOutput;
import com.estime.connection.domain.Platform;
import io.swagger.v3.oas.annotations.media.Schema;

public record ConnectedRoomCreateResponse(
        @Schema(example = "0MHMD5APPEVE1")
        String session,

        @Schema(example = "DISCORD")
        Platform platform
) {

    public static ConnectedRoomCreateResponse from(final ConnectedRoomCreateOutput output) {
        return new ConnectedRoomCreateResponse(output.session().getRoomSession().toString(), output.platform());
    }
}
