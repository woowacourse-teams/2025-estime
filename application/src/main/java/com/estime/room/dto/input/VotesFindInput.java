package com.estime.room.dto.input;

import com.estime.room.participant.ParticipantName;
import com.estime.room.RoomSession;
import com.github.f4b6a3.tsid.Tsid;

public record VotesFindInput(
        RoomSession session,
        ParticipantName name
) {

    public static VotesFindInput of(final Tsid roomSession, final String participantName) {
        return new VotesFindInput(
                RoomSession.from(roomSession),
                ParticipantName.from(participantName)
        );
    }
}
