package com.estime.sse;

import com.estime.room.RoomSession;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
@Slf4j
public class SseConnectionManager {

    private final Map<RoomSession, Map<UUID, SseConnection>> connectionFinder = new ConcurrentHashMap<>();

    public SseConnection init(final RoomSession session) {
        final SseConnection connection = save(session, SseConnection.init(session));
        setupLifeCycle(session, connection);

        return connection;
    }

    public SseConnection save(final RoomSession session, final SseConnection connection) {
        connectionFinder
                .computeIfAbsent(session, key -> new ConcurrentHashMap<>())
                .put(connection.getId(), connection);

        return connection;
    }

    public List<SseConnection> findAll(final RoomSession session) {
        final Map<UUID, SseConnection> connections = connectionFinder.get(session);
        if (connections == null) {
            return List.of();
        }
        return connections.values().stream().toList();
    }

    public void delete(final RoomSession session, final SseConnection connection) {
        final Map<UUID, SseConnection> connections = connectionFinder.get(session);
        if (connections == null) {
            return;
        }
        connections.remove(connection.getId());
        if (connections.isEmpty()) {
            connectionFinder.remove(session);
        }
    }

    private void setupLifeCycle(final RoomSession session, final SseConnection connection) {
        final SseEmitter emitter = connection.getEmitter();

        emitter.onCompletion(() -> {
            log.debug("SSE connection completed: {}", connection);
            delete(session, connection);
        });
        emitter.onTimeout(() -> {
            log.debug("SSE connection timed out: {}", connection);
            delete(session, connection);
        });
        emitter.onError((ex) -> {
            log.debug("SSE connection error: {}", ex.getMessage());
            delete(session, connection);
        });
    }
}
