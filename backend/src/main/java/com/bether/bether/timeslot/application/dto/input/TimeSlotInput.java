package com.bether.bether.timeslot.application.dto.input;

import com.bether.bether.timeslot.domain.TimeSlot;

import java.time.LocalDateTime;
import java.util.List;

public record TimeSlotInput(
        List<LocalDateTime> dateTimes
) {

    public List<TimeSlot> toEntity() {
        return dateTimes.stream()
                .map(TimeSlot::withoutId)
                .toList();
    }
}
