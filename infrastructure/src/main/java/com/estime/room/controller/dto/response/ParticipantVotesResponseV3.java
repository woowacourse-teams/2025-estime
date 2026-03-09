package com.estime.room.controller.dto.response;

import com.estime.room.dto.input.VotesOutput;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record ParticipantVotesResponseV3(
        @Schema(description = "압축된 슬롯 배열 (EPOCH: 2025-10-24T00:00+09:00)", example = "[28, 3603, 25647]")
        List<Integer> slots
) {

    public static ParticipantVotesResponseV3 from(final VotesOutput output) {
        final List<Integer> slots = output.votes().stream()
                .map(vote -> vote.getDateTimeSlot().getEncoded())
                .toList();

        return new ParticipantVotesResponseV3(slots);
    }
}
