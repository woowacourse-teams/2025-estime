package com.estime.room.application.dto.input;

import com.estime.room.domain.participant.Participant;
import com.estime.room.domain.vo.RoomSession;

public record ParticipantCreateInput(
        RoomSession session,
        String participantName
) {
    public Participant toEntity(final Long roomId) {
        return Participant.withoutId(roomId, participantName);
    }
}
