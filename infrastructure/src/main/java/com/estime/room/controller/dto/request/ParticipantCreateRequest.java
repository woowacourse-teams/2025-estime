package com.estime.room.controller.dto.request;

import com.estime.room.RoomSession;
import com.estime.room.dto.input.ParticipantCreateInput;
import com.estime.room.participant.ParticipantName;
import io.swagger.v3.oas.annotations.media.Schema;

public record ParticipantCreateRequest(
        @Schema(example = "메이토")
        String participantName
) {

    public ParticipantCreateInput toInput(final RoomSession session) {
        return new ParticipantCreateInput(
                session,
                ParticipantName.from(participantName)
        );
    }
}
