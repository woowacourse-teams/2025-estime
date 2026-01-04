package com.estime.outbox;

import com.estime.port.out.TimeProvider;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OutboxProcessingOrchestrator {

    private final TimeProvider timeProvider;

    public <T extends Outbox> void processOutboxes(
            final OutboxHandler<T> handler,
            final int batchSize
    ) {
        try {
            final List<T> outboxes = handler.claimPendingOutboxes(timeProvider.now(), batchSize);

            for (final T outbox : outboxes) {
                processOutbox(handler, outbox);
            }
        } catch (final Exception e) {
            log.error("Failed to claim pending outboxes", e);
        }
    }

    public <T extends Outbox> void recoverStaleOutboxes(
            final OutboxHandler<T> handler,
            final int batchSize
    ) {
        try {
            handler.recoverStaleProcessing(timeProvider.now(), batchSize);
        } catch (final Exception e) {
            log.error("Failed to recover stale outboxes", e);
        }
    }

    private <T extends Outbox> void processOutbox(
            final OutboxHandler<T> handler,
            final T outbox
    ) {
        try {
            handler.process(outbox);
            handler.markAsCompleted(outbox, timeProvider.now());
        } catch (final Exception e) {
            log.error("Failed to process outbox: id={}", outbox.getId(), e);
            handler.markAsFailed(outbox, timeProvider.now());
        }
    }
}
