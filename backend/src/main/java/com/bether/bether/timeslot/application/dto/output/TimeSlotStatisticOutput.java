package com.bether.bether.timeslot.application.dto.output;

import com.bether.bether.timeslot.domain.TimeSlotParticipants;
import java.util.List;

public record TimeSlotStatisticOutput(
        List<TimeSlotParticipantsOutput> statistic
) {

    public static TimeSlotStatisticOutput from(final List<TimeSlotParticipants> timeSlotParticipants) {
        return new TimeSlotStatisticOutput(
                timeSlotParticipants.stream()
                        .map(timeSlotParticipant -> new TimeSlotParticipantsOutput(
                                timeSlotParticipant.getDateTime(),
                                timeSlotParticipant.getUserNames()
                        ))
                        .toList()
        );
    }
}
