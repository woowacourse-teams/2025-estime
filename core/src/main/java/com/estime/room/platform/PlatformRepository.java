package com.estime.room.platform;

import java.util.Optional;

public interface PlatformRepository {

    Platform save(Platform platform);

    Optional<Platform> findByRoomId(Long roomId);
}
