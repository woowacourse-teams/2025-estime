package com.estime.common.exception.domain;

import com.estime.common.exception.BaseException;

public abstract class DomainException extends BaseException {

    protected DomainException(final String logMessage, final String userMessage) {
        super(logMessage, userMessage);
    }
}
