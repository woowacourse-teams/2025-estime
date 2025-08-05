package com.estime.room.presentation.dto.response;

import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

public record DateTimeSlotStatisticResponse(
        List<DateTimeSlotVotesResponse> statistic
) {

    public static DateTimeSlotStatisticResponse from(final DateTimeSlotStatisticOutput output) {
        return new DateTimeSlotStatisticResponse(
                output.statistic()
                        .stream()
                        .map(each -> new DateTimeSlotVotesResponse(
                                each.dateTimeSlot().getStartAt(),
                                each.participantNames()
                        ))
                        .sorted(Comparator.comparing(DateTimeSlotVotesResponse::dateTimeSlot))
                        .toList()
        );
    }

    private record DateTimeSlotVotesResponse(
            @Schema(example = "2026-01-01T09:00")
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
            LocalDateTime dateTimeSlot,

            @Schema(example = "[\"강산\", \"제프리\", \"플린트\", \"리버\"]")
            List<String> participantNames
    ) {
    }
}
