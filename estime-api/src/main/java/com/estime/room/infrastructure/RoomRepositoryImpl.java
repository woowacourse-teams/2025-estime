package com.estime.room.infrastructure;

import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
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
    public Optional<Room> findBySession(final String session) {
        return roomJpaRepository.findBySession(session);
    }

    @Override
    public Optional<Long> findIdBySession(final String session) {
        return roomJpaRepository.findIdBySession(session);
    }

}
