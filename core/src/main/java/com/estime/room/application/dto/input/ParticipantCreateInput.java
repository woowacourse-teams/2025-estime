package com.estime.room.application.dto.input;

import com.estime.room.domain.participant.Participant;
import com.estime.room.domain.participant.vo.ParticipantName;
import com.estime.room.domain.vo.RoomSession;

public record ParticipantCreateInput(
        RoomSession session,
        ParticipantName name
) {
    public Participant toEntity(final Long roomId) {
        return Participant.withoutId(roomId, name);
    }
}
