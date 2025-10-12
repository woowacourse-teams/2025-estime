package com.estime.sse.presentation.dto;

public record SseResponse(
        String status
) {

    public static SseResponse from(final String status) {
        return new SseResponse(status);
    }
}
