package com.estime.domain.room.exception;

import com.estime.domain.DomainTerm;
import com.estime.exception.DomainException;
import com.estime.util.ExceptionMessageFormatter;

public class UnavailableSlotException extends DomainException {

    public UnavailableSlotException(final DomainTerm term, final Object... params) {
        super(
                buildLogMessage(term, params),
                buildUserMessage(term)
        );
    }

    private static String buildLogMessage(final DomainTerm term, final Object... params) {
        return ExceptionMessageFormatter.format("%s is outside the available range".formatted(term),
                params);
    }

    private static String buildUserMessage(final DomainTerm term) {
        return "선택할 수 없는 %s 입니다.".formatted(term.label());
    }
}
