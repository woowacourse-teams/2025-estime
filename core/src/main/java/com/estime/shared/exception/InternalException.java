package com.estime.shared.exception;

public abstract class InternalException extends BaseException {

    protected InternalException(final String logMessage) {
        super(logMessage, null);
    }
}