package com.estime.platform.application.port;

import com.estime.domain.room.platform.Platform;
import java.util.Optional;

public interface PlatformRepository {

    Platform save(Platform platform);

    Optional<Platform> findByRoomId(Long roomId);
}
