package com.estime.estime.room.presentation.dto.response;

import com.estime.estime.datetimeslot.domain.DateTimeSlots;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record TotalTimeSlotResponse(
        List<TimeSlotResponse> timeSlots
) {

    public static TotalTimeSlotResponse from(final DateTimeSlots dateTimeSlots) {
        return new TotalTimeSlotResponse(dateTimeSlots.getDateTimeSlots().stream()
                .map(timeSlot -> new TimeSlotResponse(timeSlot.getUserName(), timeSlot.getStartAt()))
                .toList()
        );
    }

    private record TimeSlotResponse(
            String userName,

            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
            LocalDateTime dateTime
    ) {
    }
}
