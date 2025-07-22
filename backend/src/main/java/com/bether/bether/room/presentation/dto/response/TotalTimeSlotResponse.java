package com.bether.bether.room.presentation.dto.response;

import com.bether.bether.timeslot.domain.TimeSlots;
import java.time.LocalDateTime;
import java.util.List;

public record TotalTimeSlotResponse(
        List<TimeSlotResponse> timeSlots
) {

    public static TotalTimeSlotResponse from(final TimeSlots timeSlots) {
        return new TotalTimeSlotResponse(timeSlots.getTimeSlots().stream()
                .map(timeSlot -> new TimeSlotResponse(timeSlot.getUserName(), timeSlot.getStartAt()))
                .toList()
        );
    }

    private record TimeSlotResponse(
            String userName,
            LocalDateTime dateTime
    ) {
    }
}
