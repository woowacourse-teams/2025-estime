package com.estime.room.presentation.dto.response;

import com.estime.room.dto.output.ParticipantCreateOutput;
import io.swagger.v3.oas.annotations.media.Schema;

public record ParticipantCreateResponse(
        @Schema(example = "메이토")
        String participantName
) {
    public static ParticipantCreateResponse from(final ParticipantCreateOutput output) {
        return new ParticipantCreateResponse(output.name().getValue());
    }
}
