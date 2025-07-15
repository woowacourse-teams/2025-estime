package com.bether.bether.timeslot.application.dto.output;

import com.bether.bether.timeslot.domain.TotalTimeSlotCount;
import java.util.List;

public record TotalTimeSlotRankOutput(
        List<TimeSlotRankOutput> rank
) {

    public static TotalTimeSlotRankOutput from(final TotalTimeSlotCount totalTimeSlotCount) {
        final List<TimeSlotRankOutput> rank = totalTimeSlotCount.getRank()
                .stream()
                .map(timeSlotCount -> new TimeSlotRankOutput(
                        timeSlotCount.getDateTime(),
                        timeSlotCount.getCount(),
                        timeSlotCount.getUserNames()
                ))
                .toList();
        return new TotalTimeSlotRankOutput(rank);
    }
}
