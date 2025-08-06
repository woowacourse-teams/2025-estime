package com.estime.room.domain;

import com.estime.room.domain.vo.RoomSession;
import java.util.Optional;

public interface RoomRepository {

    Room save(Room room);

    Optional<Room> findBySession(RoomSession session);

    Optional<Long> findIdBySession(RoomSession session);
}
