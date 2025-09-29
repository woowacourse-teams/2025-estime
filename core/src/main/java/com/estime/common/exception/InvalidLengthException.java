package com.estime.common.exception;

import com.estime.common.DomainTerm;
import com.estime.common.util.ExceptionMessageFormatter;

public class InvalidLengthException extends DomainException {

    public InvalidLengthException(final DomainTerm term, final Object... params) {
        super(
                buildLogMessage(term, params),
                buildUserMessage(term)
        );
    }

    private static String buildLogMessage(final DomainTerm term, final Object... params) {
        return ExceptionMessageFormatter.format(
                "Invalid length for %s.", term.name(), params
        );
    }

    private static String buildUserMessage(final DomainTerm term) {
        return "%s의 길이가 올바르지 않습니다.".formatted(term.label());
    }
}
