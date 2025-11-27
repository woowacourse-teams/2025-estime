package com.estime.room.slot.exception;

import com.estime.shared.DomainTerm;
import com.estime.shared.exception.DomainException;
import com.estime.shared.exception.ExceptionMessageFormatter;

public class CompactDateTimeSlotOutOfRangeException extends DomainException {

    public CompactDateTimeSlotOutOfRangeException(final DomainTerm term, final Object... params) {
        super(
                buildLogMessage(term, params),
                buildUserMessage(term)
        );
    }

    private static String buildLogMessage(final DomainTerm term, final Object... params) {
        return ExceptionMessageFormatter.format(
                "Encoded value out of 20-bit range for %s.", term.name(), params
        );
    }

    private static String buildUserMessage(final DomainTerm term) {
        return "%s 인코딩 값이 유효 범위를 벗어났습니다.".formatted(term.label());
    }
}
