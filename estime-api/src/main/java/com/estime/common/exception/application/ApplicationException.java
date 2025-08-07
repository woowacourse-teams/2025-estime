package com.estime.common.exception.application;

import com.estime.common.exception.BaseException;

public abstract class ApplicationException extends BaseException {

    protected ApplicationException(final String logMessage, final String userMessage) {
        super(logMessage, userMessage);
    }
}
