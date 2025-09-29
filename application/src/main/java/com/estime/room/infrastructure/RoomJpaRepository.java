package com.estime.room.infrastructure;

import com.estime.domain.room.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomJpaRepository extends JpaRepository<Room, Long> {
}
