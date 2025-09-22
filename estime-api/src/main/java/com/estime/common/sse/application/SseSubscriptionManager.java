package com.estime.common.sse.application;

import com.estime.common.sse.domain.SseConnection;
import com.estime.room.domain.vo.RoomSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
@RequiredArgsConstructor
@Slf4j
public class SseSubscriptionManager {

    private final SseConnectionManager sseConnectionManager;
    private final SseSender sseSender;

    public SseConnection subscribe(final RoomSession session) {
        final SseConnection connection = sseConnectionManager.save(session, SseConnection.init(session));
        setupLifeCycle(session, connection);
        sseSender.send(connection, "connected");
        return connection;
    }

    private void setupLifeCycle(final RoomSession session, final SseConnection connection) {
        final SseEmitter emitter = connection.getEmitter();

        emitter.onCompletion(() -> {
            log.debug("SSE connection completed: {}", connection);
            sseConnectionManager.delete(session, connection);
        });
        emitter.onTimeout(() -> {
            log.debug("SSE connection timed out: {}", connection);
            sseConnectionManager.delete(session, connection);
        });
        emitter.onError((ex) -> {
            log.debug("SSE connection error: {}", ex.getMessage());
            sseConnectionManager.delete(session, connection);
        });
    }
}
