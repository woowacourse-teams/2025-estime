package com.bether.bether.room.presentation.dto.response;

import com.bether.bether.datetimeslot.domain.DateTimeSlots;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record TotalDateTimeSlotUpdateResponse(
        String message,
        List<TimeSlotUpdateResponse> timeSlots
) {

    public static TotalDateTimeSlotUpdateResponse from(final DateTimeSlots dateTimeSlots) {
        return new TotalDateTimeSlotUpdateResponse("저장이 완료되었습니다!",
                dateTimeSlots.getDateTimeSlots().stream()
                        .map(timeSlot -> new TimeSlotUpdateResponse(timeSlot.getUserName(), timeSlot.getStartAt()))
                        .toList()
        );
    }

    private record TimeSlotUpdateResponse(
            String userName,

            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
            LocalDateTime dateTime
    ) {
    }
}
