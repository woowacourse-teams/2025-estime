package com.estime.room.dto.output;

import com.estime.room.participant.ParticipantName;
import com.estime.room.slot.DateTimeSlot;
import java.util.List;

public record DateTimeSlotStatisticOutput(
        int participantCount,
        List<ParticipantName> participants,
        List<DateTimeParticipantsOutput> statistic
) {

    public record DateTimeParticipantsOutput(
            DateTimeSlot dateTimeSlot,
            List<ParticipantName> participantNames
    ) {
    }
}
