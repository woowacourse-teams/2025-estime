package com.estime.room.application.dto.input;

import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.participant.vote.vo.DateTimeSlot;
import java.util.List;

public record VotesUpdateInput(
        String roomSession,
        String participantName,
        List<DateTimeSlot> dateTimeSlots
) {

    public List<Vote> toEntities(final Long participantId) {
        return dateTimeSlots.stream()
                .map(dateTimeSlot -> Vote.of(participantId, dateTimeSlot))
                .toList();
    }
}
