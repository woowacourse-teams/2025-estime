package com.estime.common.exception;

import lombok.Getter;

@Getter
public abstract class BaseException extends RuntimeException {

    private final String logMessage;
    private final String userMessage;

    protected BaseException(final String logMessage,
                            final String userMessage,
                            final Throwable cause) {
        super(logMessage, cause);
        this.logMessage = logMessage;
        this.userMessage = userMessage;
    }

    protected BaseException(final String logMessage,
                            final Throwable cause) {
        super(logMessage, cause);
        this.logMessage = logMessage;
        this.userMessage = "";
    }

    protected BaseException(final String logMessage,
                            final String userMessage) {
        super(logMessage);
        this.logMessage = logMessage;
        this.userMessage = userMessage;
    }

    protected BaseException(final String logMessage) {
        super(logMessage);
        this.logMessage = logMessage;
        this.userMessage = "";
    }
}
