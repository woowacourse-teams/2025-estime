package com.estime.room.dto.output;

public record ParticipantCheckOutput(
        boolean isDuplicateName
) {

    public static ParticipantCheckOutput from(final boolean isDuplicateName) {
        return new ParticipantCheckOutput(isDuplicateName);
    }
}
