package com.bether.bether.room.presentation.dto.request;

import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TimeSlotCreateRequest(
        String userName,
        List<LocalDateTime> dateTimes
) {

    public TimeSlotInput toInput(final UUID roomSession) {
        return new TimeSlotInput(roomSession, userName, dateTimes);
    }
}
