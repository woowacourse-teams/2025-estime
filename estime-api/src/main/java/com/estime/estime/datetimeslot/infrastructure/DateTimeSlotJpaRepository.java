package com.estime.estime.datetimeslot.infrastructure;

import com.estime.estime.datetimeslot.domain.DateTimeSlot;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DateTimeSlotJpaRepository extends JpaRepository<DateTimeSlot, Long> {

    List<DateTimeSlot> findAllByRoomId(Long roomId);

    List<DateTimeSlot> findAllByRoomIdAndUserName(Long roomId, String userName);
}
