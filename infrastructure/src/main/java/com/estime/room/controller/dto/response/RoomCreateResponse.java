package com.estime.room.controller.dto.response;

import com.estime.room.dto.output.RoomCreateOutput;
import io.swagger.v3.oas.annotations.media.Schema;

public record RoomCreateResponse(
        @Schema(example = "0MHMD5APPEVE1")
        String session
) {

    public static RoomCreateResponse from(final RoomCreateOutput output) {
        return new RoomCreateResponse(output.session().getValue().toString());
    }
}
