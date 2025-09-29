package com.estime.common.sse.application;

import com.estime.common.sse.domain.SseConnection;
import com.estime.domain.room.RoomSession;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class SseConnectionManager {

    private final Map<RoomSession, Map<UUID, SseConnection>> connectionFinder = new ConcurrentHashMap<>();

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
}
