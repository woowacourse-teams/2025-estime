package com.estime.room.infrastructure.participant;

import com.estime.room.domain.participant.Participant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantJpaRepository extends JpaRepository<Participant, Long> {

    Optional<Participant> findByRoomIdAndName(Long roomId, String name);

    boolean existsByRoomIdAndName(Long roomId, String name);

    List<Participant> findAllByRoomId(Long roomId);

    List<Participant> findByIdIn(Collection<Long> ids);
}
