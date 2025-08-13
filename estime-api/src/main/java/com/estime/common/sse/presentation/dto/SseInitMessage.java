package com.estime.common.sse.presentation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.github.f4b6a3.tsid.Tsid;
import java.time.LocalDateTime;

public record SseInitMessage(
        String message,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt
) {

    public static SseInitMessage createMessage(final Tsid roomSession) {
        return new SseInitMessage(
                "SSE 연결이 성공적으로 설정되었습니다: " + roomSession.toString(),
                LocalDateTime.now()
        );
    }
}
