package com.estime.room.presentation.dto.request;

import com.estime.room.application.dto.input.VotesUpdateInput;
import com.estime.room.participant.ParticipantName;
import com.estime.room.timeslot.DateTimeSlot;
import com.estime.room.RoomSession;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.github.f4b6a3.tsid.Tsid;
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

    public VotesUpdateInput toInput(final Tsid roomSession) {
        return new VotesUpdateInput(RoomSession.from(roomSession),
                ParticipantName.from(participantName),
                dateTimeSlots.stream().map(DateTimeSlot::from).toList());
    }
}
