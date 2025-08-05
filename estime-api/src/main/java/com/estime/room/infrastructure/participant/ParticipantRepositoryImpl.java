package com.estime.room.infrastructure.participant;

import com.estime.common.BaseEntity;
import com.estime.room.domain.participant.Participant;
import com.estime.room.domain.participant.ParticipantRepository;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ParticipantRepositoryImpl implements ParticipantRepository {

    private final ParticipantJpaRepository jpaRepository;

    @Override
    public Participant save(final Participant participant) {
        return jpaRepository.save(participant);
    }

    @Override
    public boolean existsByRoomIdAndName(final Long roomId, final String name) {
        return jpaRepository.existsByRoomIdAndName(roomId, name);
    }

    @Override
    public List<Long> findIdsByRoomId(final Long roomId) {
        return jpaRepository.findAllByRoomId(roomId).stream()
                .map(BaseEntity::getId)
                .toList();
    }

    @Override
    public List<Participant> findAllByIdIn(final Set<Long> ids) {
        return jpaRepository.findByIdIn(ids);
    }

    @Override
    public Optional<Long> findIdByRoomIdAndName(final Long roomId, final String name) {
        return jpaRepository.findByRoomIdAndName(roomId, name)
                .map(Participant::getId);
    }
}
