package com.estime.room.presentation.dto.request;

import com.estime.room.application.dto.input.ParticipantDateTimeSlotUpdateInput;
import java.time.LocalDateTime;
import java.util.List;

public record ParticipantDateTimeSlotUpdateRequest(
        String userName,
        List<LocalDateTime> dateTimes
) {

    // TODO refactor roomSession type
    public String toInput(final String roomSession) {
        return new ParticipantDateTimeSlotUpdateInput(roomSession, userName, dateTimes);
    }
}
