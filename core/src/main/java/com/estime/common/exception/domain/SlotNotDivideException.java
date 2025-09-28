package com.estime.common.exception.domain;

import com.estime.common.DomainTerm;
import com.estime.common.exception.util.ExceptionMessageFormatter;

public class SlotNotDivideException extends DomainException {

    public SlotNotDivideException(final DomainTerm term, final Object... params) {
        super(
                buildLogMessage(term, params),
                buildUserMessage(term)
        );
    }

    private static String buildLogMessage(final DomainTerm term, final Object... params) {
        return ExceptionMessageFormatter.format("%s must be an interval of 30 minutes".formatted(term),
                params); // TODO 매직넘버 리팩토링
    }

    private static String buildUserMessage(final DomainTerm term) {
        return "%s는 30분 단위로 입력해야 합니다.".formatted(term.label()); // TODO: 매직넘버 리팩토링
    }
}
