package com.estime.room.application.dto.input;

import com.estime.datetimeslot.DateTimeSlot;
import com.estime.room.domain.participant.Participant;
import java.util.List;

public record ParticipantCreateInput(
        String roomSession,
        String name,
        String password,
        List<DateTimeSlot> dateTimeSlots
) {
    public Participant toEntity(final Long roomId) {
        return Participant.withoutId(roomId, name, password, dateTimeSlots);
    }
}
