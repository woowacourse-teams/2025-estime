package com.estime.common.exception.domain;

import com.estime.common.exception.util.ExceptionMessageFormatter;

public class NullNotAllowedException extends DomainException {

    public NullNotAllowedException(final Object... params) {
        super(
                buildLogMessage(params),
                buildUserMessage()
        );
    }

    private static String buildLogMessage(final Object... params) {
        return ExceptionMessageFormatter.format(" cannot be null", params);
    }

    private static String buildUserMessage() {
        return "유효하지 않은 요청입니다.";
    }
}
