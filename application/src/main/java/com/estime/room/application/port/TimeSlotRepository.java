package com.estime.room.application.port;

import com.estime.room.slot.TimeSlot;
import java.util.List;

public interface TimeSlotRepository {
    List<TimeSlot> findByRoomId(Long roomId);

    TimeSlot save(TimeSlot timeSlot);
}
