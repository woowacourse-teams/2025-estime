package com.estime.estime.room.presentation.dto.request;

import com.estime.estime.datetimeslot.application.dto.input.DateTimeSlotUpdateInput;
import java.time.LocalDateTime;
import java.util.List;

public record DateTimeSlotUpdateRequest(
        String userName,
        List<LocalDateTime> dateTimes
) {

    public DateTimeSlotUpdateInput toInput(final String roomSession) {
        return new DateTimeSlotUpdateInput(roomSession, userName, dateTimes);
    }
}
