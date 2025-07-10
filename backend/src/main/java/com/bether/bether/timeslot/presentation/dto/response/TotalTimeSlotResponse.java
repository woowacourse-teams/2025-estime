package com.bether.bether.timeslot.presentation.dto.response;

import com.bether.bether.timeslot.domain.TimeSlot;

import java.time.LocalDateTime;
import java.util.List;

public record TotalTimeSlotResponse(
        List<TimeSlotResponse> timeSlots
) {

    private record TimeSlotResponse(
            String userName,
            LocalDateTime dateTime
    ) {
    }

    public static TotalTimeSlotResponse from(final List<TimeSlot> timeSlots) {
        return new TotalTimeSlotResponse(timeSlots.stream()
                .map(timeSlot -> new TimeSlotResponse(timeSlot.getUserName(), timeSlot.getStartAt()))
                .toList()
        );
    }
}
