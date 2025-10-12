package com.estime.room.slot;

import java.util.List;

public interface DateSlotRepository {
    List<DateSlot> findByRoomId(Long roomId);

    DateSlot save(DateSlot dateSlot);
}
