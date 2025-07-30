package com.estime.estime.room.presentation.dto.request;

import com.estime.estime.datetimeslot.application.dto.input.DateTimeSlotInput;
import java.time.LocalDateTime;
import java.util.List;

public record DateTimeSlotCreateRequest(
        String userName,
        List<LocalDateTime> dateTimes
) {

    public DateTimeSlotInput toInput(final String roomSession) {
        return new DateTimeSlotInput(roomSession, userName, dateTimes);
    }
}
