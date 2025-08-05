package com.estime.connection.infrastructure;

import com.estime.connection.domain.ConnectedRoom;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConnectedRoomJpaRepository extends JpaRepository<ConnectedRoom, Long> {
    Optional<ConnectedRoom> findByRoomSession(String sessionId);
}
