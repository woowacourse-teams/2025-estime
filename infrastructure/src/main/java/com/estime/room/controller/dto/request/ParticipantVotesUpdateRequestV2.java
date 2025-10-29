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

        @Schema(description = "압축된 슬롯 코드 배열", example = "[28, 3603, 25647]")
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
