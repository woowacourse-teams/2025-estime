package com.estime.room.infrastructure;

import com.estime.room.slot.DateSlot;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DateSlotJpaRepository extends JpaRepository<DateSlot, Long> {
    List<DateSlot> findByRoomId(Long roomId);
}
