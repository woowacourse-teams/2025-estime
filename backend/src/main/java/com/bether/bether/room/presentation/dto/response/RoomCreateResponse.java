package com.bether.bether.room.presentation.dto.response;

import com.bether.bether.room.application.dto.RoomCreateOutput;

public record RoomCreateResponse(
        String session
) {

    public static RoomCreateResponse from(final RoomCreateOutput output) {
        return new RoomCreateResponse(output.session());
    }
}
