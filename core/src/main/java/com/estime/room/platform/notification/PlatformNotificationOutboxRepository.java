package com.estime.room.platform.notification;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PlatformNotificationOutboxRepository {

    PlatformNotificationOutbox save(PlatformNotificationOutbox outbox);

    Optional<PlatformNotificationOutbox> find(Long id);

    List<PlatformNotificationOutbox> findDuePendingForUpdate(Instant now, int limit);
}
