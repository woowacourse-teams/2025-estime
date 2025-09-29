package com.estime.exception;

public abstract class ApplicationException extends BaseException {

    protected ApplicationException(final String logMessage, final String userMessage) {
        super(logMessage, userMessage);
    }
}
