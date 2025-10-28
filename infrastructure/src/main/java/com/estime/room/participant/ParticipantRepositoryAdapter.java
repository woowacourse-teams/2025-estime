package com.estime.room.participant;

import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ParticipantRepositoryAdapter implements ParticipantRepository {

    private static final QParticipant participant = QParticipant.participant;
    private final ParticipantJpaRepository jpaRepository;
    private final JPAQueryFactory queryFactory;

    @Override
    public Participant save(final Participant participant) {
        return jpaRepository.save(participant);
    }

    @Override
    public int saveIgnore(final Participant participant) {
        return jpaRepository.saveIgnore(participant.getRoomId(), participant.getName().getValue(), true);
    }

    @Override
    public boolean existsByRoomIdAndName(final Long roomId, final ParticipantName name) {
        return queryFactory.select(participant.id)
                .from(participant)
                .where(participant.roomId.eq(roomId)
                        .and(participant.name.eq(name)))
                .fetchOne() != null;
    }

    @Override
    public List<Long> findIdsByRoomId(final Long roomId) {
        return queryFactory.select(participant.id)
                .from(participant)
                .where(participant.roomId.eq(roomId))
                .fetch();
    }

    @Override
    public Participants findAllByIdIn(final Set<Long> ids) {
        return Participants.from(queryFactory.selectFrom(participant)
                .where(participant.id.in(ids))
                .fetch());
    }

    @Override
    public Optional<Long> findIdByRoomIdAndName(final Long roomId, final ParticipantName name) {
        return Optional.ofNullable(
                queryFactory.select(participant.id)
                        .from(participant)
                        .where(participant.roomId.eq(roomId)
                                .and(participant.name.eq(name)))
                        .fetchOne()
        );
    }
}
