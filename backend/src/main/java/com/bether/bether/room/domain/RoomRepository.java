package com.bether.bether.room.domain;

import java.util.Optional;

public interface RoomRepository {

    Room save(Room room);

    Optional<Room> findBySession(String session);
}
