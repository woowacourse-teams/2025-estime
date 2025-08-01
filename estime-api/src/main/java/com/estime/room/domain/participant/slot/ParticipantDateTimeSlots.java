package com.estime.room.domain.participant.slot;

import com.estime.datetimeslot.DateTimeSlot;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ParticipantDateTimeSlots {

    private final List<ParticipantDateTimeSlot> participantDateTimeSlots;

    public static ParticipantDateTimeSlots from(final List<ParticipantDateTimeSlot> dateTimeSlots) {
        Objects.requireNonNull(dateTimeSlots, "dateTimeSlots cannot be null");
        return new ParticipantDateTimeSlots(List.copyOf(dateTimeSlots));
    }

    public Collection<DateTimeSlotParticipants> calculateStatistic() {
        final Map<DateTimeSlot, DateTimeSlotParticipants> participantsByDateTimeSlot = new HashMap<>();

        for (final ParticipantDateTimeSlot participantDateTimeSlot : participantDateTimeSlots) {
            participantsByDateTimeSlot
                    .computeIfAbsent(participantDateTimeSlot.getDateTimeSlot(), DateTimeSlotParticipants::from)
                    .addParticipantId(participantDateTimeSlot.getParticipantId());
        }

        return participantsByDateTimeSlot.values();
    }

    public Set<DateTimeSlot> calculateUniqueStartAts() {
        return participantDateTimeSlots.stream()
                .map(ParticipantDateTimeSlot::getDateTimeSlot)
                .collect(Collectors.toSet());
    }

    public ParticipantDateTimeSlots findSlotsToSave(
            final Set<DateTimeSlot> 삭제해야하는,
            final Long roomId,
            final Long userId
    ) {
        final Set<LocalDateTime> existingStartAts = calculateUniqueStartAts();
        return new ParticipantDateTimeSlots(삭제해야하는.stream()
                .filter(startAt -> !existingStartAts.contains(startAt))
                .map(startAt -> DateTimeSlot.from(startAt))
                .toList());
    }

    public ParticipantDateTimeSlots findSlotsToDelete(final Set<LocalDateTime> requestedStartAts) {
        return new ParticipantDateTimeSlots(participantDateTimeSlots.stream()
                .filter(timeSlot -> !requestedStartAts.contains(timeSlot.getStartAt()))
                .toList());
    }

    public boolean isEmpty() {
        return participantDateTimeSlots.isEmpty();
    }

    public boolean isNotEmpty() {
        return !isEmpty();
    }
}
