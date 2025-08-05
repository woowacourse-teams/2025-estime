package com.estime.common;

public class NotFoundException extends RuntimeException {

    public NotFoundException(final String message) {
        super(message + " not found");
    }
}
