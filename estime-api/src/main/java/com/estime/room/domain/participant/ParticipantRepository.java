package com.estime.room.domain.participant;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ParticipantRepository {

    Participant save(Participant participant);

    boolean existsByRoomIdAndName(Long roomId, String name);

    Optional<Long> findIdByRoomIdAndName(Long roomId, String name);

    List<Long> findIdsByRoomId(Long roomId);

    List<Participant> findAllByIdIn(Set<Long> ids);

    Optional<Long> findIdBySessionAndName(String session, String name);
}
