package com.estime.exception;

public class NullNotAllowedException extends DomainException {

    public NullNotAllowedException(final String name) {
        super(
                buildLogMessage(name),
                buildUserMessage()
        );
    }

    private static String buildLogMessage(final String name) {
        return String.format("%s cannot be null", name);
    }

    private static String buildUserMessage() {
        return "유효하지 않은 요청입니다.";
    }
}
