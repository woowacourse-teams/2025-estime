package com.estime.room.presentation.dto.request;

import com.estime.room.application.dto.input.ParticipantCreateInput;
import io.swagger.v3.oas.annotations.media.Schema;

public record ParticipantCreateRequest(
        @Schema(example = "메이토")
        String participantName
) {

    public ParticipantCreateInput toInput(final String roomSession) {
        return new ParticipantCreateInput(roomSession, participantName);
    }
}
