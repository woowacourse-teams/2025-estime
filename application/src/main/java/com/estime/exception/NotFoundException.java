package com.estime.exception;

import com.estime.common.DomainTerm;
import com.estime.common.util.ExceptionMessageFormatter;

public class NotFoundException extends ApplicationException {

    public NotFoundException(final DomainTerm term, final Object... params) {
        super(
                buildLogMessage(term, params),
                buildUserMessage(term)
        );
    }

    private static String buildLogMessage(final DomainTerm term, final Object... params) {
        return ExceptionMessageFormatter.format("%s is not exists".formatted(term.name()), params);
    }

    private static String buildUserMessage(final DomainTerm term) {
        return "존재하지 않는 %s입니다.".formatted(term.label());
    }
}
