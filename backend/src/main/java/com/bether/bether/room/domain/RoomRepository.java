package com.bether.bether.room.domain;

import java.util.Optional;
import java.util.UUID;

public interface RoomRepository {

    Room save(Room room);

    Optional<Room> findBySession(UUID session);
}
