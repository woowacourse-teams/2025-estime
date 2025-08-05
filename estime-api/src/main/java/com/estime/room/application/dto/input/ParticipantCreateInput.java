package com.estime.room.application.dto.input;

import com.estime.room.domain.participant.Participant;

public record ParticipantCreateInput(
        String roomSession,
        String participantName
) {
    public Participant toEntity(final Long roomId) {
        return Participant.withoutId(roomId, participantName);
    }
}
