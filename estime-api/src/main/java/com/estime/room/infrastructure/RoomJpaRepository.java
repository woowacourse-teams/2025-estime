package com.estime.room.infrastructure;

import com.estime.room.domain.Room;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomJpaRepository extends JpaRepository<Room, Long> {

    Optional<Room> findBySession(String session);

    Optional<Long> findIdBySession(String session);
}
