package com.estime.exception;

import lombok.Getter;

@Getter
public abstract class BaseException extends RuntimeException {

    private final String logMessage;
    private final String userMessage;

    protected BaseException(final String logMessage,
                            final String userMessage) {
        super(logMessage);
        this.logMessage = logMessage;
        this.userMessage = userMessage;
    }
}
