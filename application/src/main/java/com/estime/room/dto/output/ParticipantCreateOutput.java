package com.estime.room.dto.output;

import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;

public record ParticipantCreateOutput(
        ParticipantName name
) {

    public static ParticipantCreateOutput from(final Participant participant) {
        return new ParticipantCreateOutput(participant.getName());
    }
}
