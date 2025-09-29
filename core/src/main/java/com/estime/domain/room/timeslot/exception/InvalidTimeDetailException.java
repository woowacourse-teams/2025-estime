package com.estime.domain.room.timeslot.exception;

import com.estime.domain.DomainTerm;
import com.estime.exception.DomainException;
import com.estime.util.ExceptionMessageFormatter;

public class InvalidTimeDetailException extends DomainException {

    public InvalidTimeDetailException(final DomainTerm term, final Object... params) {
        super(
                buildLogMessage(term, params),
                buildUserMessage(term)
        );
    }

    private static String buildLogMessage(final DomainTerm term, final Object... params) {
        return ExceptionMessageFormatter.format(
                "seconds and nanoseconds must be 0 for %s.", term.name(), params
        );
    }

    private static String buildUserMessage(final DomainTerm term) {
        return "%s 시간은 분까지만 입력해주세요.".formatted(term.label());
    }
}
