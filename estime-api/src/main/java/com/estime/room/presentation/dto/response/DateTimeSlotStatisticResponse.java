package com.estime.room.presentation.dto.response;

import com.estime.room.domain.participant.slot.DateTimeSlotStatistic;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record DateTimeSlotStatisticResponse(
        List<DateTimeSlotParticipantsResponse> statistic
) {

    public static DateTimeSlotStatisticResponse from(final DateTimeSlotStatistic statistic) {
        final List<DateTimeSlotParticipantsResponse> rank = statistic.getStatistic()
                .stream()
                .map(rankOutput -> new DateTimeSlotParticipantsResponse(
                        rankOutput.getDateTimeSlot(),
                        rankOutput.getUserIds()
                ))
                .toList();
        return new DateTimeSlotStatisticResponse(rank);
    }

    private record DateTimeSlotParticipantsResponse(
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
            LocalDateTime dateTime,

            List<String> userNames
    ) {
    }
}
