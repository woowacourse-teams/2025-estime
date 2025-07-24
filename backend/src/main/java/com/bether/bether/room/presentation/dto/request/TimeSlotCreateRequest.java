package com.bether.bether.room.presentation.dto.request;

import com.bether.bether.datetimeslot.application.dto.input.DateTimeSlotInput;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TimeSlotCreateRequest(
        String userName,
        List<LocalDateTime> dateTimes
) {

    public DateTimeSlotInput toInput(final UUID roomSession) {
        return new DateTimeSlotInput(roomSession, userName, dateTimes);
    }
}
