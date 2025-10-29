package com.estime.room.dto.output;

import com.estime.room.participant.ParticipantName;
import com.estime.room.slot.CompactDateTimeSlot;
import java.util.List;

public record CompactDateTimeSlotStatisticOutput(
        int participantCount,
        List<ParticipantName> participants,
        List<CompactDateTimeParticipantsOutput> statistic
) {

    public record CompactDateTimeParticipantsOutput(
            CompactDateTimeSlot dateTimeSlot,
            List<ParticipantName> participantNames
    ) {
    }
}
