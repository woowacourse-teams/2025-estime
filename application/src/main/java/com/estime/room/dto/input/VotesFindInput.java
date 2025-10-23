package com.estime.room.dto.input;

import com.estime.room.RoomSession;
import com.estime.room.participant.ParticipantName;

public record VotesFindInput(
        RoomSession session,
        ParticipantName name
) {

    public static VotesFindInput of(final RoomSession session, final String participantName) {
        return new VotesFindInput(
                session,
                ParticipantName.from(participantName)
        );
    }
}
