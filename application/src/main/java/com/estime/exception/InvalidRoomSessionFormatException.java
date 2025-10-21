package com.estime.exception;

import com.estime.shared.exception.ExceptionMessageFormatter;

public class InvalidRoomSessionFormatException extends ApplicationException {

    public InvalidRoomSessionFormatException(final String invalidValue) {
        super(
                buildLogMessage(invalidValue),
                buildUserMessage()
        );
    }

    private static String buildLogMessage(final String invalidValue) {
        return ExceptionMessageFormatter.format("Invalid room session format", invalidValue);
    }

    private static String buildUserMessage() {
        return "잘못된 방 세션 형식입니다.";
    }
}
