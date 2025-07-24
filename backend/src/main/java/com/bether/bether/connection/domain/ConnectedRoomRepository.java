package com.bether.bether.connection.domain;

import java.util.Optional;
import java.util.UUID;

public interface ConnectedRoomRepository {

    ConnectedRoom save(ConnectedRoom connectedRoom);

    Optional<ConnectedRoom> findBySession(UUID sessionId);
}
