package com.estime.room.application.dto.output;

import com.estime.domain.room.participant.Participant;
import com.estime.domain.room.participant.ParticipantName;

public record ParticipantCreateOutput(
        ParticipantName name
) {

    public static ParticipantCreateOutput from(final Participant participant) {
        return new ParticipantCreateOutput(participant.getName());
    }
}
