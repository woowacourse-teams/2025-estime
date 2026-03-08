package com.estime.room.controller.dto.request;

import com.estime.room.RoomSession;
import com.estime.room.controller.dto.FlexibleInstantDeserializer;
import com.estime.room.dto.input.VotesUpdateInput;
import com.estime.room.participant.ParticipantName;
import com.estime.room.slot.DateTimeSlot;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

public record ParticipantVotesUpdateRequest(
        @Schema(example = "메이토")
        String participantName,

        @Schema(example = "[\"2026-01-01T09:00+09:00\", \"2026-01-01T09:30+09:00\"]")
        @JsonDeserialize(contentUsing = FlexibleInstantDeserializer.class)
        List<Instant> dateTimeSlots
) {

    public VotesUpdateInput toInput(final RoomSession session) {
        return new VotesUpdateInput(session,
                ParticipantName.from(participantName),
                dateTimeSlots.stream().map(DateTimeSlot::from).toList());
    }
}
