package com.estime.notification;

import com.estime.room.platform.notification.PlatformNotificationOutbox;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationOutboxJpaRepository extends JpaRepository<PlatformNotificationOutbox, Long> {
}
