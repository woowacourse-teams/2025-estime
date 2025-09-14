package com.estime.room.application.dto.output;

import com.estime.room.domain.participant.vo.ParticipantName;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import java.util.List;

public record DateTimeSlotRecommendOutput(
        List<DateTimeRecommendsOutput> recommends
) {

    public record DateTimeRecommendsOutput(
            DateTimeSlot dateTimeSlot,
            List<ParticipantName> participantNames
    ) {
    }
}
