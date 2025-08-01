package com.estime.room.presentation.dto.response;

import com.estime.room.application.dto.output.RoomCreateOutput;

public record RoomCreateResponse(
        String session
) {

    public static RoomCreateResponse from(final RoomCreateOutput output) {
        return new RoomCreateResponse(output.session());
    }
}
