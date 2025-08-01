package com.estime.room.domain.participant;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ParticipantRepository {

    Participant save(Participant participant);

    boolean existsByRoomIdAndName(Long roomId, String name);

    Optional<Participant> findByRoomIdAndName(Long roomId, String name);

    List<Long> findIdsByRoomId(Long roomId);

    Set<String> findParticipantNamesByIdIn(Set<Long> participantsIds);
}
