package com.estime.room.application.dto.input;

import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;
import com.estime.room.RoomSession;

public record ParticipantCreateInput(
        RoomSession session,
        ParticipantName name
) {
    public Participant toEntity(final Long roomId) {
        return Participant.withoutId(roomId, name);
    }
}
