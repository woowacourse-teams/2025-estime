package com.estime.room.presentation.dto.response;

import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.domain.room.participant.ParticipantName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

public record DateTimeSlotStatisticResponse(
        @Schema(example = "4")
        int participantCount,

        @Schema(example = "[\"강산\", \"제프리\", \"플린트\", \"리버\"]")
        List<String> participants,
        List<DateTimeSlotVotesResponse> statistic
) {

    public static DateTimeSlotStatisticResponse from(final DateTimeSlotStatisticOutput output) {
        return new DateTimeSlotStatisticResponse(
                output.participantCount(),
                output.participants()
                        .stream()
                        .map(ParticipantName::getValue)
                        .toList(),
                output.statistic()
                        .stream()
                        .map(each -> {
                            final List<ParticipantName> participantNames = each.participantNames();
                            return new DateTimeSlotVotesResponse(
                                    each.dateTimeSlot().getStartAt(),
                                    participantNames.stream().map(ParticipantName::getValue).toList()
                            );
                        })
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
