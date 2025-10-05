package com.estime.room;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RoomRepository {

    Room save(Room room);

    Optional<Room> findById(Long id);

    List<Room> findAllByIdGreaterThanOrderByIdAsc(Long id);

    List<Room> findAllByDeadlineAfter(LocalDateTime criterion);

    Optional<Room> findBySession(RoomSession session);

    Optional<Long> findIdBySession(RoomSession session);
}