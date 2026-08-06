package com.estime.shared.exception;

import com.estime.shared.DomainTerm;

public class MaxCountExceededException extends DomainException {

    public MaxCountExceededException(final DomainTerm term, final int maxCount, final Object... params) {
        super(
                buildLogMessage(term, params),
                buildUserMessage(term, maxCount)
        );
    }

    private static String buildLogMessage(final DomainTerm term, final Object... params) {
        return ExceptionMessageFormatter.format(
                "Count exceeds the maximum allowed for %s.", term.name(), params
        );
    }

    private static String buildUserMessage(final DomainTerm term, final int maxCount) {
        return "선택할 수 있는 %s 개수를 초과했습니다. (최대 %d개)".formatted(term.label(), maxCount);
    }
}
