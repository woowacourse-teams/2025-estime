package com.estime.room.application.dto.output;

import com.estime.room.domain.slot.vo.DateTimeSlot;
import java.util.List;

public record DateTimeSlotStatisticOutput(
        int participantCount,
        List<DateTimeParticipantsOutput> statistic
) {

    public record DateTimeParticipantsOutput(
            DateTimeSlot dateTimeSlot,
            List<String> participantNames
    ) {
    }
}
