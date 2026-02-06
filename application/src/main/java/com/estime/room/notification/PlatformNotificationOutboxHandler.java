package com.estime.room.notification;

import com.estime.outbox.OutboxHandler;
import com.estime.room.platform.notification.PlatformNotificationOutbox;
import com.estime.room.platform.notification.PlatformNotificationOutboxRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class PlatformNotificationOutboxHandler extends OutboxHandler<PlatformNotificationOutbox> {

    private final PlatformNotificationOutboxRepository repository;
    private final PlatformNotificationService platformNotificationService;

    @Override
    @Transactional
    public List<PlatformNotificationOutbox> claimPendingOutboxes(
            final Instant now,
            final int batchSize
    ) {
        final List<PlatformNotificationOutbox> outboxes = repository.findDuePendingForUpdate(now, batchSize);
        outboxes.forEach(outbox -> outbox.markAsProcessing(now));
        return outboxes;
    }

    @Override
    @Transactional
    public void recoverStaleProcessing(
            final Instant now,
            final int batchSize
    ) {
        final Instant threshold = now.minus(STALE_THRESHOLD);
        final List<PlatformNotificationOutbox> staleOutboxes =
                repository.findStaleProcessingForUpdate(threshold, batchSize);

        if (!staleOutboxes.isEmpty()) {
            log.warn("Found {} stale PROCESSING outboxes, recovering...", staleOutboxes.size());
            for (final PlatformNotificationOutbox outbox : staleOutboxes) {
                log.warn("  - id={}, roomId={}, type={}, staleDuration={}min",
                        outbox.getId(),
                        outbox.getRoomId(),
                        outbox.getPlatformNotificationType(),
                        Duration.between(outbox.getUpdatedAt(), now).toMinutes());
                outbox.recoverFromStale(now);
            }
        }
    }

    @Override
    public CompletableFuture<Void> process(final PlatformNotificationOutbox outbox) {
        return platformNotificationService.sendNotification(outbox.getRoomId(), outbox.getPlatformNotificationType());
    }

    @Override
    protected PlatformNotificationOutbox findById(final Long outboxId) {
        return repository.find(outboxId)
                .orElseThrow(() -> new IllegalStateException("Outbox not found: " + outboxId));
    }
}
