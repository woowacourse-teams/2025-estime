package com.bether.bether.timeslot.application.dto.output;

import com.bether.bether.timeslot.domain.TimeSlotStatistic;
import java.util.List;

public record TimeSlotStatisticOutput(
        List<TimeSlotParticipantsOutput> statistic
) {

    public static TimeSlotStatisticOutput from(final TimeSlotStatistic timeSlotStatistic) {
        return new TimeSlotStatisticOutput(
                timeSlotStatistic.getStatistic()
                        .stream()
                        .map(timeSlotParticipants -> new TimeSlotParticipantsOutput(
                                timeSlotParticipants.getDateTime(),
                                timeSlotParticipants.getUserNames()
                        ))
                        .toList()
        );
    }
}
