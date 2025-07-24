package com.bether.bether.room.presentation.dto.request;

import com.bether.bether.datetimeslot.application.dto.input.DateTimeSlotUpdateInput;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TimeSlotUpdateRequest(
        String userName,
        List<LocalDateTime> dateTimes
) {

    public DateTimeSlotUpdateInput toInput(final UUID roomSession) {
        return new DateTimeSlotUpdateInput(roomSession, userName, dateTimes);
    }
}
