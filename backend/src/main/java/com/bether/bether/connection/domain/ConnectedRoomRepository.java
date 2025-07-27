package com.bether.bether.connection.domain;

import java.util.Optional;

public interface ConnectedRoomRepository {

    ConnectedRoom save(ConnectedRoom connectedRoom);

    Optional<ConnectedRoom> findBySession(String sessionId);
}
