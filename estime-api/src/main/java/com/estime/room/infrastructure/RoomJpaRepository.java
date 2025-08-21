package com.estime.room.infrastructure;

import com.estime.room.domain.Room;
import com.estime.room.domain.vo.RoomSession;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomJpaRepository extends JpaRepository<Room, Long> {

    Optional<Room> findBySessionAndActiveTrue(RoomSession session);

    Optional<Room> findByIdAndActiveTrue(Long id);

    List<Room> findAllByIdGreaterThanAndActiveTrueOrderByIdAsc(Long id);

    List<Room> findAllByDeadlineAfterAndActiveTrue(LocalDateTime deadline);
}
