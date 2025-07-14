package com.bether.bether.room.infrastructure;

import com.bether.bether.room.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomJpaRepository extends JpaRepository<Room, Long> {
}
