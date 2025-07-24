package com.bether.bether.room.presentation.dto.response;

import com.bether.bether.datetimeslot.application.dto.output.DateTimeSlotStatisticOutput;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record TimeSlotStatisticResponse(
        List<TimeSlotParticipantsResponse> statistic
) {

    public static TimeSlotStatisticResponse from(final DateTimeSlotStatisticOutput output) {
        final List<TimeSlotParticipantsResponse> rank = output.statistic()
                .stream()
                .map(rankOutput -> new TimeSlotParticipantsResponse(
                        rankOutput.dateTime(),
                        rankOutput.userNames()
                ))
                .toList();
        return new TimeSlotStatisticResponse(rank);
    }

    private record TimeSlotParticipantsResponse(
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
            LocalDateTime dateTime,

            List<String> userNames
    ) {
    }
}
