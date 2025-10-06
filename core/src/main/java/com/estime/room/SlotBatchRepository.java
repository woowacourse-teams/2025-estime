package com.estime.room;

import com.estime.room.slot.DateSlot;
import com.estime.room.slot.TimeSlot;
import java.util.Collection;

public interface SlotBatchRepository {

    void batchInsertSlots(final Long roomId, final Collection<DateSlot> dateSlots, final Collection<TimeSlot> timeSlots);
}
