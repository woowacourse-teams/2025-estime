package com.estime.room.dto.input;

import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.vote.Vote;
import com.estime.room.slot.DateTimeSlot;
import com.estime.room.RoomSession;
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
