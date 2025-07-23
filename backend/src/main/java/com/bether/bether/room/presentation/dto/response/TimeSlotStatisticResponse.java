package com.bether.bether.room.presentation.dto.response;

import com.bether.bether.timeslot.application.dto.output.TimeSlotStatisticOutput;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record TimeSlotStatisticResponse(
        List<TimeSlotParticipantsResponse> statistic
) {

    public static TimeSlotStatisticResponse from(final TimeSlotStatisticOutput output) {
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
