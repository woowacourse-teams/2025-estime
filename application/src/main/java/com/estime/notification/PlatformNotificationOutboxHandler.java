package com.estime.notification;

import com.estime.outbox.Outbox;
import com.estime.outbox.OutboxHandler;
import com.estime.room.platform.notification.PlatformNotificationOutbox;
import com.estime.room.platform.notification.PlatformNotificationOutboxRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class PlatformNotificationOutboxHandler extends OutboxHandler<PlatformNotificationOutbox> {

    private final PlatformNotificationOutboxRepository repository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public List<PlatformNotificationOutbox> claimPendingOutboxes(
            final Instant now,
            final int batchSize
    ) {
        final List<PlatformNotificationOutbox> outboxes = repository.findDuePendingForUpdate(now, batchSize);
        outboxes.forEach(Outbox::markAsProcessing);
        return outboxes;
    }

    @Override
    public void process(final PlatformNotificationOutbox outbox) {
        switch (outbox.getPlatformNotificationType()) {
            case CREATION -> notificationService.sendCreationNotification(outbox.getRoomId());
            case REMINDER -> notificationService.sendReminderNotification(outbox.getRoomId());
            case DEADLINE -> notificationService.sendDeadlineNotification(outbox.getRoomId());
        }
    }
}
