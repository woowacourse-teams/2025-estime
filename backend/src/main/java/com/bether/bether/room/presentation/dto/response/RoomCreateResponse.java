package com.bether.bether.room.presentation.dto.response;

import com.bether.bether.room.application.dto.RoomCreatedOutput;

public record RoomCreateResponse(
        String session
) {

    public static RoomCreateResponse from(final RoomCreatedOutput output) {
        return new RoomCreateResponse(output.session().toString());
    }
}
