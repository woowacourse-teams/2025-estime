package com.estime.room.infrastructure;

import com.estime.room.slot.TimeSlot;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotJpaRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByRoomId(Long roomId);
}
