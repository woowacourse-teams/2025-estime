package com.estime.room.infrastructure;

import com.estime.room.slot.AvailableDateSlot;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailableDateSlotJpaRepository extends JpaRepository<AvailableDateSlot, Long> {
    List<AvailableDateSlot> findByRoomId(Long roomId);
}
