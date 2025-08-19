package com.estime.common.sse.presentation.dto;

public record SseResponse(
        String status
) {

    public static SseResponse of(final String status) {
        return new SseResponse(status);
    }
}
