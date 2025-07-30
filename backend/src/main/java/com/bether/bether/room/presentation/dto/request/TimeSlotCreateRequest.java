package com.bether.bether.room.presentation.dto.request;

import com.bether.bether.datetimeslot.application.dto.input.DateTimeSlotInput;
import java.time.LocalDateTime;
import java.util.List;

public record TimeSlotCreateRequest(
        String userName,
        List<LocalDateTime> dateTimes
) {

    public DateTimeSlotInput toInput(final String roomSession) {
        return new DateTimeSlotInput(roomSession, userName, dateTimes);
    }
}
