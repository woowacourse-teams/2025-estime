package com.estime.room.slot;

import java.util.List;

public interface AvailableDateSlotRepository {

    List<AvailableDateSlot> findByRoomId(Long roomId);

    AvailableDateSlot save(AvailableDateSlot availableDateSlot);
}
