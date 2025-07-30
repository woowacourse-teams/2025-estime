package com.estime.estime.room.presentation.dto.response;

import com.estime.estime.room.application.dto.RoomCreateOutput;

public record RoomCreateResponse(
        String session
) {

    public static RoomCreateResponse from(final RoomCreateOutput output) {
        return new RoomCreateResponse(output.session());
    }
}
