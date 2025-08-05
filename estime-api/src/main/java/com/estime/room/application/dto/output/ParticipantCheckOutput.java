package com.estime.room.application.dto.output;

public record ParticipantCheckOutput(
        boolean exists
) {

    public static ParticipantCheckOutput from(final boolean exists) {
        return new ParticipantCheckOutput(exists);
    }
}
