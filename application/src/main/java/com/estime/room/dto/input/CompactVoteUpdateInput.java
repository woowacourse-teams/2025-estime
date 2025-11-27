package com.estime.room.dto.input;

import com.estime.room.RoomSession;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.vote.compact.CompactVote;
import com.estime.room.slot.CompactDateTimeSlot;
import java.util.List;

public record CompactVoteUpdateInput(
        RoomSession session,
        ParticipantName name,
        List<CompactDateTimeSlot> dateTimeSlots
) {

    public List<CompactVote> toEntities(final Long participantId) {
        return dateTimeSlots.stream()
                .map(dateTimeSlot -> CompactVote.of(participantId, dateTimeSlot))
                .toList();
    }
}
