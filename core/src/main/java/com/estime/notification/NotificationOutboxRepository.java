package com.estime.notification;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface NotificationOutboxRepository {

    PlatformNotificationOutbox save(PlatformNotificationOutbox outbox);

    Optional<PlatformNotificationOutbox> find(Long id);

    List<PlatformNotificationOutbox> findPendingForUpdate(Instant now, int limit);
}
