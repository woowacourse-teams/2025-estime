package com.estime.common.exception.domain;

import com.estime.common.exception.BaseException;

public abstract class DomainException extends BaseException {

    protected DomainException(final String logMessage, final String userMessage, final Throwable cause) {
        super(logMessage, userMessage, cause);
    }

    protected DomainException(final String logMessage, final Throwable cause) {
        super(logMessage, cause);
    }

    protected DomainException(final String logMessage, final String userMessage) {
        super(logMessage, userMessage);
    }

    protected DomainException(final String logMessage) {
        super(logMessage);
    }
}
