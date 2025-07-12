package com.bether.bether.timeslot.presentation.dto.response;

import com.bether.bether.timeslot.application.dto.output.TotalTimeSlotRankOutput;
import java.time.LocalDateTime;
import java.util.List;

public record TotalTimeSlotRankResponse(
        List<TimeSlotRankResponse> rank
) {

    private record TimeSlotRankResponse(
            LocalDateTime dateTime,
            Integer count,
            List<String> userNames
    ) {
    }

    public static TotalTimeSlotRankResponse from(TotalTimeSlotRankOutput output) {
        List<TimeSlotRankResponse> rank = output.rank()
                .stream()
                .map(rankOutput -> new TimeSlotRankResponse(
                        rankOutput.dateTime(),
                        rankOutput.count(),
                        rankOutput.userNames()
                ))
                .toList();
        return new TotalTimeSlotRankResponse(rank);
    }
}
