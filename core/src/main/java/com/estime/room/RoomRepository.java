package com.estime.room;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface RoomRepository {

    Room save(Room room);

    Optional<Room> findById(Long id);

    List<Room> findAllByIdGreaterThanOrderByIdAsc(Long id);

    List<Room> findAllByDeadlineAfter(Instant criterion);

    Optional<Room> findBySession(RoomSession session);

    Optional<Room> findWithAvailableSlotsBySession(RoomSession session);

    Optional<Long> findIdBySession(RoomSession session);
}
