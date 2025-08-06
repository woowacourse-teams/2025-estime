package com.estime.room.presentation.dto.response;

import com.estime.room.application.dto.output.RoomCreateOutput;
import io.swagger.v3.oas.annotations.media.Schema;

public record RoomCreateResponse(
        @Schema(example = "0MHMD5APPEVE1")
        String session
) {

    public static RoomCreateResponse from(final RoomCreateOutput output) {
        return new RoomCreateResponse(output.session().getTsid().toString());
    }
}
