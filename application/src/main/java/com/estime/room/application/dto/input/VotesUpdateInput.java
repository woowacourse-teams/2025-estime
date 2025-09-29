package com.estime.room.application.dto.input;

import com.estime.domain.room.participant.ParticipantName;
import com.estime.domain.room.participant.vote.Vote;
import com.estime.domain.room.timeslot.DateTimeSlot;
import com.estime.domain.room.RoomSession;
import java.util.List;

public record VotesUpdateInput(
        RoomSession session,
        ParticipantName name,
        List<DateTimeSlot> dateTimeSlots
) {

    public List<Vote> toEntities(final Long participantId) {
        return dateTimeSlots.stream()
                .map(dateTimeSlot -> Vote.of(participantId, dateTimeSlot))
                .toList();
    }
}
