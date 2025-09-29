package com.estime.exception;


import com.estime.shared.exception.BaseException;

public abstract class ApplicationException extends BaseException {

    protected ApplicationException(final String logMessage, final String userMessage) {
        super(logMessage, userMessage);
    }
}
