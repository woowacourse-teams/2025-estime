package com.estime.outbox;

import com.estime.outbox.exception.InvalidOutboxStateException;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@MappedSuperclass
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public abstract class Outbox {

    private static final int MAX_RETRY_COUNT = 5;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OutboxStatus status;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt;

    @Column(name = "retry_count", nullable = false)
    private int retryCount;

    protected Outbox(final Instant scheduledAt) {
        this.status = OutboxStatus.PENDING;
        this.scheduledAt = scheduledAt;
        this.retryCount = 0;
    }

    public void markAsProcessing() {
        if (status == OutboxStatus.PROCESSING) {
            return;
        }
        if (status != OutboxStatus.PENDING) {
            throw new InvalidOutboxStateException(status, OutboxStatus.PENDING);
        }
        this.status = OutboxStatus.PROCESSING;
    }

    public void markAsCompleted() {
        if (status == OutboxStatus.COMPLETED) {
            return;
        }
        if (status != OutboxStatus.PROCESSING) {
            throw new InvalidOutboxStateException(status, OutboxStatus.PROCESSING);
        }
        this.status = OutboxStatus.COMPLETED;
    }

    public void markAsFailed() {
        this.retryCount++;

        if (this.retryCount >= MAX_RETRY_COUNT) {
            this.status = OutboxStatus.FAILED;
            return;
        }

        this.status = OutboxStatus.PENDING;
        this.scheduledAt = calculateNextRetryTime();
    }

    private Instant calculateNextRetryTime() {
        final long delayMinutes = 1L << (retryCount - 1);
        return Instant.now().plus(delayMinutes, ChronoUnit.MINUTES);
    }
}
