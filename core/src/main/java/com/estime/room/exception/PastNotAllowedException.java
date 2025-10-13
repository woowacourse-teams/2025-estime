package com.estime.room.exception;

import com.estime.shared.DomainTerm;
import com.estime.shared.exception.DomainException;
import com.estime.shared.exception.ExceptionMessageFormatter;

public class PastNotAllowedException extends DomainException {

    public PastNotAllowedException(final DomainTerm term, final Object... params) {
        super(
                buildLogMessage(term, params),
                buildUserMessage(term)
        );
    }

    private static String buildLogMessage(final DomainTerm term, final Object... params) {
        return ExceptionMessageFormatter.format("%s cannot be past".formatted(term.name()), params);
    }

    private static String buildUserMessage(final DomainTerm term) {
        return "%s에 과거는 입력할 수 없습니다.".formatted(term.label());
    }

}
