package com.estime.outbox;

import com.estime.port.out.TimeProvider;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OutboxProcessingOrchestrator {

    private final TimeProvider timeProvider;
    private final Executor outboxCallbackExecutor;

    public <T extends Outbox> void processOutboxes(
            final OutboxHandler<T> handler,
            final int batchSize
    ) {
        try {
            final List<T> outboxes = handler.claimPendingOutboxes(timeProvider.now(), batchSize);

            if (outboxes.isEmpty()) {
                return;
            }

            logOutboxClaimSummary(outboxes);

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

    private <T extends Outbox> void logOutboxClaimSummary(final List<T> outboxes) {
        final Map<String, List<T>> grouped = outboxes.stream()
                .collect(Collectors.groupingBy(Outbox::getDescription));
        final StringBuilder sb = new StringBuilder();
        sb.append("Processing ").append(outboxes.size()).append(" pending outboxes");
        grouped.forEach((label, group) -> {
            final String ids = group.stream()
                    .map(o -> String.valueOf(o.getId()))
                    .collect(Collectors.joining(","));
            sb.append("\n  ").append(label).append(": id=").append(ids);
        });

        log.info(String.valueOf(sb));
    }

    private <T extends Outbox> void processOutbox(
            final OutboxHandler<T> handler,
            final T outbox
    ) {
        handler.process(outbox)
                .thenRunAsync(
                        () -> onSuccess(handler, outbox),
                        outboxCallbackExecutor
                )
                .exceptionallyAsync(
                        ex -> onFailure(handler, outbox, ex),
                        outboxCallbackExecutor
                );
    }

    private <T extends Outbox> void onSuccess(
            final OutboxHandler<T> handler,
            final T outbox
    ) {
        try {
            handler.markAsCompleted(outbox, timeProvider.now());
        } catch (final Exception e) {
            log.error("Failed to mark outbox as completed: id={}", outbox.getId(), e);
        }
    }

    private <T extends Outbox> Void onFailure(
            final OutboxHandler<T> handler,
            final T outbox,
            final Throwable ex
    ) {
        log.error("Failed to process outbox: id={}", outbox.getId(), ex);
        try {
            handler.markAsFailed(outbox, timeProvider.now());
        } catch (final Exception e) {
            log.error("Failed to mark outbox as failed: id={}", outbox.getId(), e);
        }
        return null;
    }
}
