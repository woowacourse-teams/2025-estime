package com.estime.room.infrastructure;

import com.estime.room.QRoom;
import com.estime.room.Room;
import com.estime.room.RoomSession;
import com.estime.room.application.port.RoomRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RoomRepositoryAdapter implements RoomRepository {

    private static final QRoom room = QRoom.room;
    private final RoomJpaRepository roomJpaRepository;
    private final JPAQueryFactory queryFactory;

    @Override
    public Room save(final Room room) {
        return roomJpaRepository.save(room);
    }

    @Override
    public Optional<Room> findBySession(final RoomSession session) {
        return Optional.ofNullable(
                queryFactory.selectFrom(room)
                        .where(room.session.eq(session))
                        .fetchOne()
        );
    }

    @Override
    public Optional<Long> findIdBySession(final RoomSession session) {
        return Optional.ofNullable(
                queryFactory.select(room.id)
                        .from(room)
                        .where(room.session.eq(session))
                        .fetchOne()
        );
    }

    @Override
    public Optional<Room> findById(final Long id) {
        return Optional.ofNullable(
                queryFactory.selectFrom(room)
                        .where(room.id.eq(id))
                        .fetchOne()
        );
    }

    @Override
    public List<Room> findAllByIdGreaterThanOrderByIdAsc(final Long id) {
        return queryFactory.selectFrom(room)
                .where(room.id.gt(id))
                .orderBy(room.id.asc())
                .fetch();
    }

    @Override
    public List<Room> findAllByDeadlineAfter(final LocalDateTime criterion) {
        return queryFactory.selectFrom(room)
                .where(room.deadline.after(criterion))
                .fetch();
    }
}
