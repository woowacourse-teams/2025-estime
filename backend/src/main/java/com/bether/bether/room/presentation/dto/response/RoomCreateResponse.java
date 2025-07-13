package com.bether.bether.room.presentation.dto.response;

import com.bether.bether.room.application.dto.RoomOutput;

public record RoomCreateResponse(
        String session
) {

    public static RoomCreateResponse from(final RoomOutput output) {
        return new RoomCreateResponse(output.session().toString());
    }
}
