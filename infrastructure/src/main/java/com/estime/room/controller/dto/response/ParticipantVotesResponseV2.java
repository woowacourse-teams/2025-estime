package com.estime.room.controller.dto.response;

import com.estime.room.dto.input.CompactVotesOutput;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record ParticipantVotesResponseV2(
        @Schema(description = "압축된 슬롯 코드 배열", example = "[28, 3603, 25647]")
        List<Integer> slotCodes
) {

    public static ParticipantVotesResponseV2 from(final CompactVotesOutput output) {
        final List<Integer> slotCodes = output.votes().stream()
                .map(vote -> vote.getCompactDateTimeSlot().getEncoded())
                .toList();

        return new ParticipantVotesResponseV2(slotCodes);
    }
}
