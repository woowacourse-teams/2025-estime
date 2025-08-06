package com.estime.room.presentation.dto.response;

import com.estime.room.application.dto.output.ParticipantCheckOutput;
import io.swagger.v3.oas.annotations.media.Schema;

public record ParticipantCheckResponse(
        @Schema(example = "true")
        boolean isDuplicateName
) {
    public static ParticipantCheckResponse from(final ParticipantCheckOutput output) {
        return new ParticipantCheckResponse(output.isDuplicateName());
    }
}
