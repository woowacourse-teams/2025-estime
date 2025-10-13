package com.estime.room.dto.input;

import com.estime.room.RoomSession;
import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;

public record ParticipantCreateInput(
        RoomSession session,
        ParticipantName name
) {
    public Participant toEntity(final Long roomId) {
        return Participant.withoutId(roomId, name);
    }
}
