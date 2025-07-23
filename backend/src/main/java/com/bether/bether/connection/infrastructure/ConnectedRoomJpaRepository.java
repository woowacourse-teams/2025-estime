package com.bether.bether.connection.infrastructure;

import com.bether.bether.connection.domain.ConnectedRoom;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConnectedRoomJpaRepository extends JpaRepository<ConnectedRoom, Long> {
    Optional<ConnectedRoom> findByRoomSession(UUID sessionId);
}
