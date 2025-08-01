package com.estime.room.infrastructure.participant.slot;

import com.estime.room.domain.participant.ParticipantDateTimeSlotId;
import com.estime.room.domain.participant.slot.ParticipantDateTimeSlot;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantDateTimeSlotJpaRepository extends JpaRepository<ParticipantDateTimeSlot, ParticipantDateTimeSlotId> {

    List<ParticipantDateTimeSlot> findAllByUserId(Long userId);

    List<ParticipantDateTimeSlot> findAllInParticipantIds(List<Long> participantIds);
}
