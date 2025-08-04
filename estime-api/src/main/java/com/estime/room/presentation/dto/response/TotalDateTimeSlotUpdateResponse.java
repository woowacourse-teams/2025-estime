package com.estime.room.presentation.dto.response;

import com.estime.room.domain.participant.vote.vo.Votes;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public record TotalDateTimeSlotUpdateResponse(
        String message,
        List<TimeSlotUpdateResponse> timeSlots
) {

    public static TotalDateTimeSlotUpdateResponse from(final Votes dateTimeSlots) {
        return new TotalDateTimeSlotUpdateResponse("저장이 완료되었습니다!",
                dateTimeSlots.getVotes().stream()
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
