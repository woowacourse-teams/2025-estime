package com.estime.room.controller.dto.response;

import com.estime.room.slot.CompactDateTimeSlot;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;
import java.util.Set;

public record VoteStatisticResponseV2(
        @Schema(description = "총 참가자 수")
        int totalParticipants,

        @Schema(description = "슬롯별 투표 통계")
        List<SlotStatisticV2> statistics
) {

    public record SlotStatisticV2(
            @Schema(description = "슬롯 코드", example = "28")
            int slotCode,

            @Schema(description = "투표 수")
            int voteCount,

            @Schema(description = "투표율 (%)")
            double percentage,

            @Schema(description = "투표한 참가자 ID 목록")
            List<Long> participantIds
    ) {
    }

    public static VoteStatisticResponseV2 from(
            Map<CompactDateTimeSlot, Set<Long>> statistic,
            int totalParticipants
    ) {
        List<SlotStatisticV2> statistics = statistic.entrySet().stream()
                .map(entry -> {
                    CompactDateTimeSlot slot = entry.getKey();
                    Set<Long> participantIds = entry.getValue();
                    int voteCount = participantIds.size();
                    double percentage = totalParticipants > 0
                            ? (double) voteCount / totalParticipants * 100
                            : 0.0;

                    return new SlotStatisticV2(
                            slot.getEncoded(),
                            voteCount,
                            percentage,
                            participantIds.stream().sorted().toList()
                    );
                })
                .sorted((a, b) -> Integer.compare(a.slotCode, b.slotCode))
                .toList();

        return new VoteStatisticResponseV2(totalParticipants, statistics);
    }
}
