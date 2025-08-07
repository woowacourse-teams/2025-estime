package com.estime.connection.domain;

import com.estime.room.domain.vo.RoomSession;
import java.util.Optional;

public interface ConnectedRoomRepository {

    ConnectedRoom save(ConnectedRoom connectedRoom);

    Optional<ConnectedRoom> findBySession(RoomSession session);
}
