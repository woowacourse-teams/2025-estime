package com.bether.bether.room.infrastructure;

import com.bether.bether.room.domain.Room;
import com.bether.bether.room.domain.RoomRepository;
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
}
