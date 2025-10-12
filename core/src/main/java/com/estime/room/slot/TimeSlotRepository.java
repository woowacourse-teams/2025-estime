package com.estime.room.slot;

import java.util.List;

public interface TimeSlotRepository {
    List<TimeSlot> findByRoomId(Long roomId);

    TimeSlot save(TimeSlot timeSlot);
}
