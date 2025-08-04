package com.estime.room.application.dto.output;

import com.estime.room.domain.participant.vote.vo.DateTimeSlot;
import java.util.List;

public record DateTimeSlotStatisticOutput(
        List<DateTimeParticipantsOutput> statistic
) {

    public record DateTimeParticipantsOutput(
            DateTimeSlot dateTimeSlot,
            List<String> participantNames
    ) {
    }
}
