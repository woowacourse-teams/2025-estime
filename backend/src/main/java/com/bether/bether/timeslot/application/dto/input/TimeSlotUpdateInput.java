package com.bether.bether.timeslot.application.dto.input;

import com.bether.bether.timeslot.domain.TimeSlot;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TimeSlotUpdateInput(
        UUID roomSession,
        String userName,
        List<LocalDateTime> dateTimes
) {
    public List<TimeSlot> toEntity(final Long roomId) {
        return dateTimes.stream()
                .map(dateTime -> TimeSlot.withoutId(roomId, userName, dateTime))
                .toList();
    }
}
