package com.bether.bether.timeslot.presentation.dto.request;

import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TimeSlotCreateRequest(
        UUID roomSession,
        String userName,
        List<LocalDateTime> dateTimes
) {

    public TimeSlotInput toInput() {
        return new TimeSlotInput(roomSession, userName, dateTimes);
    }
}
