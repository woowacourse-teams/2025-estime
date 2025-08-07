package com.estime.connection.infrastructure;

import com.estime.connection.domain.ConnectedRoom;
import com.estime.room.domain.vo.RoomSession;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConnectedRoomJpaRepository extends JpaRepository<ConnectedRoom, Long> {
    Optional<ConnectedRoom> findByRoomSession(RoomSession session);
}
