package com.estime.room.controller.dto.response;

import com.estime.room.dto.output.CompactDateTimeSlotStatisticOutput;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record VoteStatisticResponseV2(
        @Schema(description = "총 참가자 수")
        int totalParticipants,

        @Schema(description = "슬롯별 투표 통계")
        List<SlotStatisticV2> statistics
) {

    public static VoteStatisticResponseV2 from(final CompactDateTimeSlotStatisticOutput output) {
        final List<SlotStatisticV2> statistics = output.statistic().stream()
                .map(stat -> {
                    final int voteCount = stat.participantNames().size();
                    final double percentage = output.participantCount() > 0
                            ? (double) voteCount / output.participantCount() * 100
                            : 0.0;

                    return new SlotStatisticV2(
                            stat.dateTimeSlot().getEncoded(),
                            voteCount,
                            percentage,
                            stat.participantNames().stream()
                                    .map(name -> name.getValue())
                                    .toList()
                    );
                })
                .sorted((a, b) -> Integer.compare(a.slotCode, b.slotCode))
                .toList();

        return new VoteStatisticResponseV2(output.participantCount(), statistics);
    }

    public record SlotStatisticV2(
            @Schema(description = "슬롯 코드", example = "28")
            int slotCode,

            @Schema(description = "투표 수")
            int voteCount,

            @Schema(description = "투표율 (%)")
            double percentage,

            @Schema(description = "투표한 참가자 이름 목록")
            List<String> participantNames
    ) {
    }
}
