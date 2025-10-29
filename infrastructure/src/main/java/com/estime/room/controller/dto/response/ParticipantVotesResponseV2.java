package com.estime.room.controller.dto.response;

import com.estime.room.participant.vote.compact.CompactVotes;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record ParticipantVotesResponseV2(
        @Schema(description = "압축된 슬롯 코드 배열", example = "[28, 3603, 25647]")
        List<Integer> slotCodes
) {

    public static ParticipantVotesResponseV2 from(CompactVotes votes) {
        List<Integer> slotCodes = votes.getSortedVotes().stream()
                .map(vote -> vote.dateTimeSlot().getEncoded())
                .toList();

        return new ParticipantVotesResponseV2(slotCodes);
    }
}
