package com.estime.room.domain.participant.slot;

import java.util.List;

public interface ParticipantDateTimeSlotRepository {

    ParticipantDateTimeSlots findAllByParticipantIds(List<Long> participantIds);

    ParticipantDateTimeSlot save(ParticipantDateTimeSlot participantDateTimeSlot);

    ParticipantDateTimeSlots saveAll(ParticipantDateTimeSlots dateTimeSlots);

    void deleteAllInBatch(ParticipantDateTimeSlots dateTimeSlots);
}
