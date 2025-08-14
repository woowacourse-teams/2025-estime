package com.estime.common.exception.domain;

import com.estime.common.DomainTerm;
import com.estime.common.exception.util.ExceptionMessageFormatter;

public class DeadlineOverdueException extends DomainException {

    public DeadlineOverdueException(final DomainTerm term, final Object... params) {
        super(
                buildLogMessage(term, params),
                buildUserMessage()
        );
    }

    private static String buildLogMessage(final DomainTerm term, final Object... params) {
        return ExceptionMessageFormatter.format("Deadline exceeded for %s".formatted(term), params);
    }

    private static String buildUserMessage() {
        return "마감기한이 경과되어 더이상 추가/수정하실 수 없습니다. 결과를 확인해 주세요.";
    }
}
