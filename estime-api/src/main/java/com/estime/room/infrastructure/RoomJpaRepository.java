package com.estime.room.infrastructure;

import com.estime.room.domain.Room;
import com.estime.room.domain.vo.RoomSession;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RoomJpaRepository extends JpaRepository<Room, Long> {

    Optional<Room> findBySessionAndActiveTrue(RoomSession session);

    List<Room> findAllByIdGreaterThanOrderByIdAsc(Long id);

    @Query("SELECT r FROM Room r WHERE r.deadline > :deadline")
    List<Room> findAllByDeadlineAfter(@Param("deadline") LocalDateTime deadline);

}
