package com.estime.common.exception.domain;

import com.estime.common.exception.util.ExceptionMessageFormatter;

public final class InvalidRangeException extends DomainException {

    public InvalidRangeException(final String fieldName, final int value, final int min, final int max) {
        super(
                buildLogMessage(fieldName, value, min, max),
                buildUserMessage(fieldName, min, max)
        );
    }

    private static String buildLogMessage(final String fieldName, final int value, final int min, final int max) {
        return ExceptionMessageFormatter.format(
                "Invalid range for %s: %d (expected: %d-%d)", 
                fieldName, value, min, max
        );
    }

    private static String buildUserMessage(final String fieldName, final int min, final int max) {
        return "%s은(는) %d에서 %d 사이의 값이어야 합니다.".formatted(fieldName, min, max);
    }
}