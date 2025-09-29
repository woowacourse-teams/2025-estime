package com.estime.room.application.dto.output;

import com.estime.domain.room.participant.ParticipantName;
import com.estime.domain.room.timeslot.DateTimeSlot;
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
