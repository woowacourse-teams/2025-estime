package com.estime.common.exception.application;

import com.estime.common.exception.util.ExceptionMessageFormatter;

public class InternalLogOnlyException extends ApplicationException {

    public InternalLogOnlyException(final String message, final Object... params) {
        super(
                buildLogMessage(message, params),
                buildUserMessage()
        );
    }

    private static String buildLogMessage(final String message, final Object... params) {
        return ExceptionMessageFormatter.format(message, params);
    }

    private static String buildUserMessage() {
        return "서버에 오류가 발생했습니다.";
    }
}
