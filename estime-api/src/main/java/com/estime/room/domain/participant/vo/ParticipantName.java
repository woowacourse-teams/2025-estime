package com.estime.room.domain.participant.vo;

import com.estime.common.DomainTerm;
import com.estime.common.exception.domain.InvalidLengthException;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;


@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@EqualsAndHashCode
public class ParticipantName {

    private static final int NAME_MAX_LENGTH = 12;

    private String value;

    public static ParticipantName from(final String name) {
        final String trimmedName = name.trim();
        validate(trimmedName);
        return new ParticipantName(trimmedName);
    }

    private static void validate(final String name) {
        if (name.isBlank() || name.length() > NAME_MAX_LENGTH) {
            throw new InvalidLengthException(DomainTerm.PARTICIPANT, name);
        }
    }
}
