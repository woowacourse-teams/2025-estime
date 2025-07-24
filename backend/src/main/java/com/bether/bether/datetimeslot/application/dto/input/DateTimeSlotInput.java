package com.bether.bether.datetimeslot.application.dto.input;

import com.bether.bether.datetimeslot.domain.DateTimeSlot;
import com.bether.bether.datetimeslot.domain.DateTimeSlots;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record DateTimeSlotInput(
        UUID roomSession,
        String userName,
        List<LocalDateTime> dateTimes
) {

    public DateTimeSlots toEntity(final Long roomId) {
        return DateTimeSlots.from(dateTimes.stream()
                .map(dateTime -> DateTimeSlot.withoutId(roomId, userName, dateTime))
                .toList());
    }
}
