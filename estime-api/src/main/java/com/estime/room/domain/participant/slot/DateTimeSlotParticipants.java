package com.estime.room.domain.participant.slot;

import com.estime.datetimeslot.DateTimeSlot;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class DateTimeSlotParticipants {

    private final DateTimeSlot dateTimeSlot;
    private final Set<Long> participantIds;

    public static DateTimeSlotParticipants from(final DateTimeSlot dateTimeSlot) {
        return new DateTimeSlotParticipants(dateTimeSlot, new HashSet<>());
    }

    public void addParticipantId(final Long participantId) {
        participantIds.add(participantId);
    }

    public int size() {
        return participantIds.size();
    }
}
