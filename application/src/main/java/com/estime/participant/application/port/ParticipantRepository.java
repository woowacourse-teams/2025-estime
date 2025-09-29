package com.estime.participant.application.port;

import com.estime.domain.room.participant.Participant;
import com.estime.domain.room.participant.ParticipantName;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ParticipantRepository {

    Participant save(Participant participant);

    boolean existsByRoomIdAndName(Long roomId, ParticipantName name);

    Optional<Long> findIdByRoomIdAndName(Long roomId, ParticipantName name);

    List<Long> findIdsByRoomId(Long roomId);

    List<Participant> findAllByIdIn(Set<Long> ids);
}
