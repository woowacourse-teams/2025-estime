package com.estime.outbox.exception;

import com.estime.outbox.OutboxStatus;
import com.estime.shared.exception.ExceptionMessageFormatter;
import com.estime.shared.exception.InternalException;

public class InvalidOutboxStateException extends InternalException {

    public InvalidOutboxStateException(final OutboxStatus current, final OutboxStatus expected) {
        super(buildLogMessage(current, expected));
    }

    private static String buildLogMessage(final OutboxStatus current, final OutboxStatus expected) {
        return ExceptionMessageFormatter.format(
                "Invalid outbox state transition: expected %s, but was %s".formatted(expected, current),
                current, expected
        );
    }
}