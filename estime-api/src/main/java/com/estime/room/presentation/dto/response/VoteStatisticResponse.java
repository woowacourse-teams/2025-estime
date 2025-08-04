package com.estime.room.presentation.dto.response;

import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record VoteStatisticResponse(
        List<DateTimeSlotParticipantsResponse> statistic
) {

    public static VoteStatisticResponse from(final DateTimeSlotStatisticOutput output) {
        return new VoteStatisticResponse(
                output.statistic()
                        .stream()
                        .map(each -> new DateTimeSlotParticipantsResponse(
                                each.dateTimeSlot().getStartAt(),
                                each.participantNames()
                        ))
                        .toList()
        );
    }

    private record DateTimeSlotParticipantsResponse(
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
            LocalDateTime dateTime,

            List<String> participantNames
    ) {
    }
}
