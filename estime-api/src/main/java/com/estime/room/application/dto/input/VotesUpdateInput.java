package com.estime.room.application.dto.input;

import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.vo.RoomSession;
import java.util.List;

public record VotesUpdateInput(
        RoomSession roomSession,
        String participantName,
        List<DateTimeSlot> dateTimeSlots
) {

    public List<Vote> toEntities(final Long participantId) {
        return dateTimeSlots.stream()
                .map(dateTimeSlot -> Vote.of(participantId, dateTimeSlot))
                .toList();
    }
}
