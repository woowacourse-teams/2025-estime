package com.estime.room.application.dto.output;

import com.estime.room.domain.participant.Participant;
import com.estime.room.domain.participant.vo.ParticipantName;

public record ParticipantCreateOutput(
        ParticipantName name
) {

    public static ParticipantCreateOutput from(final Participant participant) {
        return new ParticipantCreateOutput(participant.getName());
    }
}
