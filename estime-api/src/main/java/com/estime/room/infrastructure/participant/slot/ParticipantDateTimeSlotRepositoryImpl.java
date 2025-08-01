package com.estime.room.infrastructure.participant.slot;

import com.estime.room.domain.participant.slot.ParticipantDateTimeSlot;
import com.estime.room.domain.participant.slot.ParticipantDateTimeSlotRepository;
import com.estime.room.domain.participant.slot.ParticipantDateTimeSlots;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ParticipantDateTimeSlotRepositoryImpl implements ParticipantDateTimeSlotRepository {

    private final ParticipantDateTimeSlotJpaRepository jpaRepository;

    @Override
    public ParticipantDateTimeSlot save(final ParticipantDateTimeSlot participantDateTimeSlot) {
        return jpaRepository.save(participantDateTimeSlot);
    }

    @Override
    public ParticipantDateTimeSlots saveAll(final ParticipantDateTimeSlots dateTimeSlots) {
        return ParticipantDateTimeSlots.from(
                jpaRepository.saveAll(dateTimeSlots.getParticipantDateTimeSlots()));
    }

    @Override
    public ParticipantDateTimeSlots findAllByParticipantIds(final List<Long> participantIds) {
        return ParticipantDateTimeSlots.from(
                jpaRepository.findAllInParticipantIds(participantIds));
    }

    @Override
    public void deleteAllInBatch(final ParticipantDateTimeSlots dateTimeSlots) {
        jpaRepository.deleteAllInBatch(
                dateTimeSlots.getParticipantDateTimeSlots());
    }
}
