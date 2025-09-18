package com.estime.room.infrastructure.participant;

import com.estime.room.domain.participant.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantJpaRepository extends JpaRepository<Participant, Long> {
}
