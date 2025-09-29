package com.estime.room.presentation.dto.request;

import com.estime.room.application.dto.input.ParticipantCreateInput;
import com.estime.domain.room.participant.ParticipantName;
import com.estime.domain.room.RoomSession;
import com.github.f4b6a3.tsid.Tsid;
import io.swagger.v3.oas.annotations.media.Schema;

public record ParticipantCreateRequest(
        @Schema(example = "메이토")
        String participantName
) {

    public ParticipantCreateInput toInput(final Tsid roomSession) {
        return new ParticipantCreateInput(
                RoomSession.from(roomSession),
                ParticipantName.from(participantName)
        );
    }
}
