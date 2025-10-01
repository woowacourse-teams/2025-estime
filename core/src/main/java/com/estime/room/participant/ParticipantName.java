package com.estime.room.participant;

import com.estime.shared.DomainTerm;
import com.estime.shared.exception.InvalidLengthException;
import com.estime.shared.Validator;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.experimental.FieldNameConstants;


@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@EqualsAndHashCode
@FieldNameConstants
public class ParticipantName {

    private static final int NAME_MAX_LENGTH = 12;

    private String value;

    public static ParticipantName from(final String participantName) {
        validateNull(participantName);
        final String trimmedName = participantName.trim();
        validateName(trimmedName);
        return new ParticipantName(trimmedName);
    }

    private static void validateNull(final String participantName) {
        Validator.builder()
                .add("participantName", participantName)
                .validateNull();
    }

    private static void validateName(final String participantName) {
        if (participantName.isBlank() || participantName.length() > NAME_MAX_LENGTH) {
            throw new InvalidLengthException(DomainTerm.PARTICIPANT, participantName);
        }
    }
}
