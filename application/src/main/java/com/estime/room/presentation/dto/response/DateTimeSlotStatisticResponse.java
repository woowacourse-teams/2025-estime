package com.estime.room.presentation.dto.response;

import com.estime.room.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.participant.ParticipantName;
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

        @Schema(example = "3")
        int maxVoteCount,

        List<DateTimeSlotVotesResponse> statistic
) {

    public static DateTimeSlotStatisticResponse from(final DateTimeSlotStatisticOutput output) {
        final int participantCount = output.participantCount();
        return new DateTimeSlotStatisticResponse(
                participantCount,
                output.participants()
                        .stream()
                        .map(ParticipantName::getValue)
                        .toList(),
                output.statistic()
                        .stream()
                        .mapToInt(each1 -> each1.participantNames().size())
                        .max()
                        .orElse(0),
                output.statistic()
                        .stream()
                        .map(each -> {
                            final List<ParticipantName> participantNames = each.participantNames();
                            final int voteCount = each.participantNames().size();
                            final double weight = Math.round((double) voteCount / participantCount * 100.0) / 100.0;
                            return new DateTimeSlotVotesResponse(
                                    each.dateTimeSlot().getStartAt(),
                                    voteCount,
                                    weight,
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

            @Schema(example = "3")
            int voteCount,

            @Schema(example = "0.75")
            double weight,

            @Schema(example = "[\"강산\", \"플린트\", \"리버\"]")
            List<String> participantNames
    ) {
    }
}
