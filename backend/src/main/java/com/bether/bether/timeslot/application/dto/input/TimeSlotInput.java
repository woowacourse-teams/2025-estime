package com.bether.bether.timeslot.application.dto.input;

import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlots;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TimeSlotInput(
        UUID roomSession,
        String userName,
        List<LocalDateTime> dateTimes
) {

    public TimeSlots toEntity(final Long roomId) {
        return TimeSlots.from(dateTimes.stream()
                .map(dateTime -> TimeSlot.withoutId(roomId, userName, dateTime))
                .toList());
    }
}
