package com.estime.room.presentation.dto.response;

import com.estime.room.application.dto.output.ParticipantCreateOutput;

public record ParticipantCreateResponse(
        String name
) {
    public static ParticipantCreateResponse from(final ParticipantCreateOutput output) {
        return new ParticipantCreateResponse(output.name());
    }
}
