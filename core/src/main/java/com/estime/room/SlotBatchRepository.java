package com.estime.room;

import com.estime.room.slot.AvailableDateSlot;
import com.estime.room.slot.AvailableTimeSlot;
import java.util.Collection;

public interface SlotBatchRepository {

    void batchInsertSlots(final Collection<AvailableDateSlot> availableDateSlots,
                          final Collection<AvailableTimeSlot> availableTimeSlots);
}
