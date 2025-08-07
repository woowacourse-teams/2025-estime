package com.estime.room.infrastructure;

import com.estime.room.domain.Room;
import com.estime.room.domain.vo.RoomSession;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomJpaRepository extends JpaRepository<Room, Long> {

    Optional<Room> findBySession(RoomSession session);

    Optional<Long> findIdBySession(RoomSession session);
}
