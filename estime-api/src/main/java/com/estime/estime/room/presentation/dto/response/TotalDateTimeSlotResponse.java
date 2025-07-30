package com.estime.estime.room.presentation.dto.response;

import com.estime.estime.datetimeslot.domain.DateTimeSlots;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record TotalDateTimeSlotResponse(
        List<DateTimeSlotResponse> dateTimeSlots
) {

    public static TotalDateTimeSlotResponse from(final DateTimeSlots dateTimeSlots) {
        return new TotalDateTimeSlotResponse(dateTimeSlots.getDateTimeSlots().stream()
                .map(dateTimeSlot -> new DateTimeSlotResponse(dateTimeSlot.getUserName(), dateTimeSlot.getStartAt()))
                .toList()
        );
    }

    private record DateTimeSlotResponse(
            String userName,

            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
            LocalDateTime dateTime
    ) {
    }
}
