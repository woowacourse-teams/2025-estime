package com.estime.room.domain.participant.slot;

import java.time.LocalDateTime;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParticipantDateTimeSlotDomainService {

    public ParticipantDateTimeSlots updateDateTimeSlots(final Long roomId, final DateTimeSlotUpdateInput input) {
        final ParticipantDateTimeSlots existing = userDateTimeSlotRepository.findAllByRoomIdAndUserName(roomId,
                input.userId());
        final Set<LocalDateTime> existingStartAts = existing.calculateUniqueStartAts();
        final Set<LocalDateTime> requestedStartAts = Set.copyOf(input.dateTimes());

        // TODO DB 조회 로직 최적화 필요
        if (existingStartAts.equals(requestedStartAts)) {
            return getAllByRoomIdAndUserName(roomId, input.userName());
        }

        final ParticipantDateTimeSlots dateTimeSlotsToSave = existing.findSlotsToSave(requestedStartAts, roomId,
                input.userName());
        final ParticipantDateTimeSlots dateTimeSlotsToDelete = existing.findSlotsToDelete(requestedStartAts);

        if (dateTimeSlotsToSave.isNotEmpty()) {
            dateTimeSlotRepository.saveAll(dateTimeSlotsToSave);
        }
        if (dateTimeSlotsToDelete.isNotEmpty()) {
            dateTimeSlotRepository.deleteAllInBatch(dateTimeSlotsToDelete);
        }

        return getAllByRoomIdAndUserName(roomId, input.userName());
    }
}
