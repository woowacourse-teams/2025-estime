package com.bether.bether.room.presentation.dto.request;

import com.bether.bether.timeslot.application.dto.input.TimeSlotUpdateInput;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TimeSlotUpdateRequest(
        String userName,
        List<LocalDateTime> dateTimes
) {

    public TimeSlotUpdateInput toInput(final UUID roomSession) {
        return new TimeSlotUpdateInput(roomSession, userName, dateTimes);
    }
}
