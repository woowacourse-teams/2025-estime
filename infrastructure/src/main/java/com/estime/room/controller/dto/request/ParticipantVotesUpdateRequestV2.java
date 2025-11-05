package com.estime.room.controller.dto.request;

import com.estime.room.RoomSession;
import com.estime.room.dto.input.CompactVoteUpdateInput;
import com.estime.room.participant.ParticipantName;
import com.estime.room.slot.CompactDateTimeSlot;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record ParticipantVotesUpdateRequestV2(
        @Schema(example = "메이토")
        String participantName,

        @Schema(description = "압축된 슬롯 코드 배열 (EPOCH: 2025-10-24)",
                example = "[17682, 17683, 17684, 17685, 17686, 17687, 17688, 17689, 17938, 17939, 17940, 17941, 17942, 17943, 17944, 17945]")
        List<Integer> slotCodes
) {

    public List<CompactDateTimeSlot> toCompactSlots() {
        if (slotCodes == null || slotCodes.isEmpty()) {
            return List.of();
        }
        return slotCodes.stream()
                .map(CompactDateTimeSlot::from)
                .toList();
    }

    public CompactVoteUpdateInput toInput(final RoomSession session) {
        return new CompactVoteUpdateInput(
                session,
                ParticipantName.from(participantName),
                toCompactSlots()
        );
    }
}
