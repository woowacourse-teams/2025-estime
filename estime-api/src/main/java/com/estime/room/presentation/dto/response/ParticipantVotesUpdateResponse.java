package com.estime.room.presentation.dto.response;

import com.estime.room.domain.participant.vote.Votes;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;

public record ParticipantVotesUpdateResponse(
        @Schema(example = "메이토")
        String participantName,

        @Schema(example = "[\"2026-01-01T09:00\", \"2026-01-01T10:00\"]")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        List<LocalDateTime> dateTimeSlots
) {

    public static ParticipantVotesUpdateResponse of(final Votes votes, final String participantName) {
        return new ParticipantVotesUpdateResponse(participantName,
                votes.getElements().stream()
                        .map(vote -> vote.getId().getDateTimeSlot().getStartAt())
                        .sorted()
                        .toList()
        );
    }
}
