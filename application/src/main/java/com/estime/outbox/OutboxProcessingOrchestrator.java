package com.estime.outbox;

import java.time.Instant;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class OutboxProcessingOrchestrator {

    public <T extends Outbox> void processOutboxes(
            final OutboxHandler<T> handler,
            final Instant now,
            final int batchSize
    ) {
        final List<T> outboxes = handler.claimPendingOutboxes(now, batchSize);

        for (final T outbox : outboxes) {
            processOutbox(handler, outbox);
        }
    }

    private <T extends Outbox> void processOutbox(
            final OutboxHandler<T> handler,
            final T outbox
    ) {
        try {
            handler.process(outbox);
            handler.markAsCompleted(outbox);
        } catch (final Exception e) {
            log.error("Failed to process outbox: id={}", outbox.getId(), e);
            handler.markAsFailed(outbox);
        }
    }
}
