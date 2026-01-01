package com.estime.notification;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationOutboxJpaRepository extends JpaRepository<PlatformNotificationOutbox, Long> {
}
