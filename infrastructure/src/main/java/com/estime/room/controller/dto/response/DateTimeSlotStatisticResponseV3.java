package com.estime.room.controller.dto.response;

import com.estime.room.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.participant.ParticipantName;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Comparator;
import java.util.List;

public record DateTimeSlotStatisticResponseV3(
        @Schema(example = "4")
        int participantCount,

        @Schema(example = "[\"강산\", \"제프리\", \"플린트\", \"리버\"]")
        List<String> participants,

        @Schema(example = "3")
        int maxVoteCount,

        @Schema(description = "슬롯별 투표 통계")
        List<DateTimeSlotVotesResponseV3> statistics
) {

    public static DateTimeSlotStatisticResponseV3 from(final DateTimeSlotStatisticOutput output) {
        final int participantCount = output.participantCount();
        final List<DateTimeSlotVotesResponseV3> statistics = output.statistic().stream()
                .map(stat -> {
                    final int voteCount = stat.participantNames().size();
                    final double weight = Math.round((double) voteCount / participantCount * 100.0) / 100.0;

                    return new DateTimeSlotVotesResponseV3(
                            stat.dateTimeSlot().getEncoded(),
                            voteCount,
                            weight,
                            stat.participantNames().stream()
                                    .map(ParticipantName::getValue)
                                    .toList()
                    );
                })
                .sorted(Comparator.comparingInt(DateTimeSlotVotesResponseV3::slot))
                .toList();

        return new DateTimeSlotStatisticResponseV3(
                participantCount,
                output.participants()
                        .stream()
                        .map(ParticipantName::getValue)
                        .toList(),
                output.statistic()
                        .stream()
                        .mapToInt(each -> each.participantNames().size())
                        .max()
                        .orElse(0),
                statistics
        );
    }

    private record DateTimeSlotVotesResponseV3(
            @Schema(description = "슬롯 (EPOCH: 2025-10-24T00:00+09:00)", example = "28")
            int slot,

            @Schema(description = "투표 수", example = "3")
            int voteCount,

            @Schema(description = "투표 비율 (0-1)", example = "0.75")
            double weight,

            @Schema(description = "투표한 참가자 이름 목록", example = "[\"강산\", \"플린트\", \"리버\"]")
            List<String> participantNames
    ) {
    }
}
