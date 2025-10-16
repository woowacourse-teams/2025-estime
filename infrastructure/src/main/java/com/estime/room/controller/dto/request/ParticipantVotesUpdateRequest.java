package com.estime.room.controller.dto.request;

import com.estime.room.RoomSession;
import com.estime.room.dto.input.VotesUpdateInput;
import com.estime.room.participant.ParticipantName;
import com.estime.room.slot.DateTimeSlot;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;

public record ParticipantVotesUpdateRequest(
        @Schema(example = "메이토")
        String participantName,

        @Schema(example = "[\"2026-01-01T09:00\", \"2026-01-01T10:00\"]")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        List<LocalDateTime> dateTimeSlots
) {

    public VotesUpdateInput toInput(final RoomSession session) {
        return new VotesUpdateInput(session,
                ParticipantName.from(participantName),
                dateTimeSlots.stream().map(DateTimeSlot::from).toList());
    }
}
