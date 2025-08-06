package com.estime.room.presentation.dto.request;

import com.estime.room.application.dto.input.ParticipantCreateInput;
import com.estime.room.domain.vo.RoomSession;
import com.github.f4b6a3.tsid.Tsid;
import io.swagger.v3.oas.annotations.media.Schema;

public record ParticipantCreateRequest(
        @Schema(example = "메이토")
        String participantName
) {

    public ParticipantCreateInput toInput(final Tsid tsid) {
        return new ParticipantCreateInput(RoomSession.from(tsid), participantName);
    }
}
