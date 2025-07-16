package com.bether.bether.room.infrastructure;

import com.bether.bether.room.domain.Room;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomJpaRepository extends JpaRepository<Room, Long> {

    Optional<Room> findBySession(UUID session);
}
