package com.estime.room.controller.dto.response;

import com.estime.room.dto.input.VotesOutput;
import com.estime.room.participant.vote.Vote;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;

public record ParticipantVotesResponse(
        @Schema(example = "메이토")
        String participantName,

        @Schema(example = "[\"2026-01-01T09:00\", \"2026-01-01T10:00\"]")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        List<LocalDateTime> dateTimeSlots
) {

    public static ParticipantVotesResponse from(final VotesOutput output) {
        return new ParticipantVotesResponse(
                output.name().getValue(),
                output.votes().stream()
                        .map(Vote::startAt)
                        .toList()
        );
    }
}
