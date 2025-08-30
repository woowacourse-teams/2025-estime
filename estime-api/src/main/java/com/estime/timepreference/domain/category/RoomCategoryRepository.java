package com.estime.timepreference.domain.category;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RoomCategoryRepository {

    RoomCategory save(RoomCategory category);

    List<RoomCategory> saveAll(List<RoomCategory> categories);

    Optional<RoomCategory> findByRoomId(Long roomId);

    List<RoomCategory> findAllInRoomId(Collection<Long> roomIds);
}
