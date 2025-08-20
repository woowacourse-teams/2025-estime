package com.estime.room.infrastructure.participant;

import com.estime.room.domain.participant.Participant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantJpaRepository extends JpaRepository<Participant, Long> {

    Optional<Participant> findByRoomIdAndNameAndActiveTrue(Long roomId, String name);

    boolean existsByRoomIdAndNameAndActiveTrue(Long roomId, String name);

    List<Participant> findAllByRoomIdAndActiveTrue(Long roomId);

    List<Participant> findByIdInAndActiveTrue(Collection<Long> ids);
}
