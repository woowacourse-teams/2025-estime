package com.estime.room.controller.dto.response;

import com.estime.room.dto.output.ConnectedRoomCreateOutput;
import io.swagger.v3.oas.annotations.media.Schema;

public record ConnectedRoomCreateResponse(
        @Schema(example = "0MHMD5APPEVE1")
        String session,

        @Schema(example = "DISCORD")
        String platformType
) {

    public static ConnectedRoomCreateResponse from(final ConnectedRoomCreateOutput output) {
        return new ConnectedRoomCreateResponse(output.session().getValue().toString(), output.type().name());
    }
}
