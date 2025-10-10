package com.estime.shared.exception;

public class InternalLogOnlyException extends BaseException {

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
