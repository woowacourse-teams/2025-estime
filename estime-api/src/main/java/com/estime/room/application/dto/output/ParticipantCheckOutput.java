package com.estime.room.application.dto.output;

public record ParticipantCheckOutput(
        boolean isDuplicateName
) {

    public static ParticipantCheckOutput from(final boolean isDuplicateName) {
        return new ParticipantCheckOutput(isDuplicateName);
    }
}
