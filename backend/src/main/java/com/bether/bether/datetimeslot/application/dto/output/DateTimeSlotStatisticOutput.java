package com.bether.bether.datetimeslot.application.dto.output;

import com.bether.bether.datetimeslot.domain.DateTimeSlotParticipants;
import java.util.List;

public record DateTimeSlotStatisticOutput(
        List<DateTimeSlotParticipantsOutput> statistic
) {

    public static DateTimeSlotStatisticOutput from(final List<DateTimeSlotParticipants> dateTimeSlotParticipants) {
        return new DateTimeSlotStatisticOutput(
                dateTimeSlotParticipants.stream()
                        .map(timeSlotParticipant -> new DateTimeSlotParticipantsOutput(
                                timeSlotParticipant.getDateTime(),
                                timeSlotParticipant.getUserNames()
                        ))
                        .toList()
        );
    }
}
