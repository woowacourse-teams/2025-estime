package com.bether.bether.timeslot.application.dto.input;

import com.bether.bether.timeslot.domain.TimeSlot;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TimeSlotInput(
        UUID roomSession,
        String userName,
        List<LocalDateTime> dateTimes
) {

    public List<TimeSlot> toEntity() {
        return dateTimes.stream()
                .map(dateTime -> TimeSlot.withoutId(roomSession, userName, dateTime))
                .toList();
    }
}
