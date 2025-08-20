package com.estime.room.infrastructure;

import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
import com.estime.room.domain.vo.RoomSession;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RoomRepositoryImpl implements RoomRepository {

    private final RoomJpaRepository roomJpaRepository;

    @Override
    public Room save(final Room room) {
        return roomJpaRepository.save(room);
    }

    @Override
    public Optional<Room> findBySession(final RoomSession session) {
        return roomJpaRepository.findBySessionAndActiveTrue(session);
    }

    @Override
    public Optional<Long> findIdBySession(final RoomSession session) {
        return findBySession(session).map(Room::getId);
    }
}
