package com.estime.sse;

import com.estime.room.RoomSession;
import com.estime.sse.controller.dto.SseResponse;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.SseEventBuilder;

@Component
@RequiredArgsConstructor
@Slf4j
public class SseSender {

    private final SseConnectionManager sseConnectionManager;

    public void send(
            final SseConnection connection,
            final String message
    ) {
        connection.send(buildSseEvent(message), sseConnectionManager::delete);
    }

    public void broadcast(
            final RoomSession session,
            final String message
    ) {
        sseConnectionManager.findAll(session)
                .forEach(connection -> send(connection, message));
    }

    private SseEventBuilder buildSseEvent(final String message) {
        return SseEmitter.event()
                .name(message)
                .id(UUID.randomUUID().toString())
                .data(SseResponse.from("ok"));
    }
}
