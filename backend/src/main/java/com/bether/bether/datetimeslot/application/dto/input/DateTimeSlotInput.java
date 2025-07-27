package com.bether.bether.datetimeslot.application.dto.input;

import com.bether.bether.datetimeslot.domain.DateTimeSlot;
import com.bether.bether.datetimeslot.domain.DateTimeSlots;
import java.time.LocalDateTime;
import java.util.List;

public record DateTimeSlotInput(
        String roomSession,
        String userName,
        List<LocalDateTime> dateTimes
) {

    public DateTimeSlots toEntity(final Long roomId) {
        return DateTimeSlots.from(dateTimes.stream()
                .map(dateTime -> DateTimeSlot.withoutId(roomId, userName, dateTime))
                .toList());
    }
}
