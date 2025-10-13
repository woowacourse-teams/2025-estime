package com.estime.room.infrastructure;

import com.estime.room.slot.AvailableTimeSlot;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailableTimeSlotJpaRepository extends JpaRepository<AvailableTimeSlot, Long> {
    List<AvailableTimeSlot> findByRoomId(Long roomId);
}
