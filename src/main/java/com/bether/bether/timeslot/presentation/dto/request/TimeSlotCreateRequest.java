package com.bether.bether.timeslot.presentation.dto.request;

import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;

import java.time.LocalDateTime;
import java.util.List;

public record TimeSlotCreateRequest(
        String roomId,
        String name,
        List<LocalDateTime> dateTimes
) {

    public TimeSlotInput toInput() {
        return new TimeSlotInput(dateTimes);
    }
}
