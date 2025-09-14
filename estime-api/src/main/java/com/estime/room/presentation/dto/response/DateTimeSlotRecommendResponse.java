package com.estime.room.presentation.dto.response;

import com.estime.room.application.dto.output.DateTimeSlotRecommendOutput;
import com.estime.room.domain.participant.vo.ParticipantName;
import java.time.LocalDateTime;
import java.util.List;

public record DateTimeSlotRecommendResponse(
        List<DateTimeSlotVotesResponse> recommends
) {

    public static DateTimeSlotRecommendResponse from(final DateTimeSlotRecommendOutput output) {
        return new DateTimeSlotRecommendResponse(
                output.recommends()
                        .stream()
                        .map(each -> new DateTimeSlotVotesResponse(
                                each.dateTimeSlot().getStartAt(),
                                each.participantNames().stream().map(ParticipantName::getValue).toList()
                        ))
                        .toList()
        );
    }

    private record DateTimeSlotVotesResponse(
            LocalDateTime dateTimeSlot,
            List<String> participantNames
    ) {
    }
}
