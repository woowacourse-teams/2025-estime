package com.estime.estime.room.presentation.dto.response;

import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotStatisticOutput;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record DateTimeSlotStatisticResponse(
        List<DateTimeSlotParticipantsResponse> statistic
) {

    public static DateTimeSlotStatisticResponse from(final DateTimeSlotStatisticOutput output) {
        final List<DateTimeSlotParticipantsResponse> rank = output.statistic()
                .stream()
                .map(rankOutput -> new DateTimeSlotParticipantsResponse(
                        rankOutput.dateTime(),
                        rankOutput.userNames()
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
