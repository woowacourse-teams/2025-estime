package com.estime.participant.infrastructure;

import com.estime.room.participant.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantJpaRepository extends JpaRepository<Participant, Long> {
}
