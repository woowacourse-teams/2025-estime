package com.estime.sse;

import com.estime.room.RoomSession;
import com.estime.room.event.Event;
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
            final Event event
    ) {
        connection.send(buildSseEvent(event), sseConnectionManager::delete);
    }

    public void broadcast(
            final RoomSession session,
            final Event event
    ) {
        sseConnectionManager.findAll(session)
                .forEach(connection -> send(connection, event));
    }

    private SseEventBuilder buildSseEvent(final Event event) {
        return SseEmitter.event()
                .name(event.getEventName())
                .id(UUID.randomUUID().toString())
                .data(event);
    }
}
