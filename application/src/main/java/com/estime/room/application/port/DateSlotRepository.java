package com.estime.room.application.port;

import com.estime.room.slot.DateSlot;
import java.util.List;

public interface DateSlotRepository {
    List<DateSlot> findByRoomId(Long roomId);

    DateSlot save(DateSlot dateSlot);
}
