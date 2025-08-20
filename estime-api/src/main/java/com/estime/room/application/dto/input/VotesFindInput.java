package com.estime.room.application.dto.input;

import com.estime.room.domain.participant.vo.ParticipantName;
import com.estime.room.domain.vo.RoomSession;
import com.github.f4b6a3.tsid.Tsid;

public record VotesFindInput(
        RoomSession session,
        ParticipantName name
) {

    public static VotesFindInput of(Tsid roomSession, String participantName) {
        return new VotesFindInput(
                RoomSession.from(roomSession),
                ParticipantName.from(participantName)
        );
    }
}
