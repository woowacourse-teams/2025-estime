package com.estime.room.slot;

import java.util.List;

public interface AvailableTimeSlotRepository {
    List<AvailableTimeSlot> findByRoomId(Long roomId);

    AvailableTimeSlot save(AvailableTimeSlot availableTimeSlot);
}
