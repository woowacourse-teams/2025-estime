package com.estime.room.application.dto.output;

import com.estime.room.domain.participant.Participant;

public record ParticipantCreateOutput(
        String name
) {

    public static ParticipantCreateOutput from(final Participant participant) {
        return new ParticipantCreateOutput(participant.getName());
    }
}
