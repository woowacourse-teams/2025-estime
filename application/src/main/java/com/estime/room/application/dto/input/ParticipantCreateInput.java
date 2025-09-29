package com.estime.room.application.dto.input;

import com.estime.domain.room.participant.Participant;
import com.estime.domain.room.participant.ParticipantName;
import com.estime.domain.room.RoomSession;

public record ParticipantCreateInput(
        RoomSession session,
        ParticipantName name
) {
    public Participant toEntity(final Long roomId) {
        return Participant.withoutId(roomId, name);
    }
}
