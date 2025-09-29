package com.estime.common.exception;

public abstract class DomainException extends BaseException {

    protected DomainException(final String logMessage, final String userMessage) {
        super(logMessage, userMessage);
    }
}
