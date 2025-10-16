package com.estime.room.dto.input;

import com.estime.room.RoomSession;
import com.estime.room.participant.ParticipantName;

public record VotesFindInput(
        RoomSession session,
        ParticipantName name
) {

    public static VotesFindInput of(final String roomSession, final String participantName) {
        return new VotesFindInput(
                RoomSession.from(roomSession),
                ParticipantName.from(participantName)
        );
    }
}
