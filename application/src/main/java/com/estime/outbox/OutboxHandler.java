package com.estime.outbox;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

public abstract class OutboxHandler<T extends Outbox> {

    protected static final Duration STALE_THRESHOLD = Duration.ofMinutes(10);

    /**
     * 처리할 Outbox들을 조회하고 PROCESSING 상태로 변경 (Claim)
     * <p>
     * 1. 동시성 제어: FOR UPDATE 락과 상태 변경을 하나의 트랜잭션으로 처리하여 여러 워커가 동시에 같은 Outbox를 처리하는 것을 방지
     * <p>
     * 2. 트랜잭션 분리: 짧은 트랜잭션으로 빠르게 완료하여 이후 외부 API 호출을 트랜잭션 밖에서 실행할 수 있도록 함
     *
     * @param now       현재 시각 (이 시각 이전에 스케줄된 Outbox만 조회)
     * @param batchSize 한 번에 처리할 Outbox 개수
     * @return PROCESSING 상태로 변경된 Outbox 목록
     */
    @Transactional
    public abstract List<T> claimPendingOutboxes(
            Instant now,
            int batchSize
    );

    /**
     * 실제 작업 수행
     * <p>
     * 이미 PROCESSING 상태인 Outbox에 대해 비즈니스 로직을 실행합니다. 외부 API 호출 등이 포함될 수 있으므로 트랜잭션 없이 실행됩니다.
     *
     * @param outbox 처리할 Outbox (이미 PROCESSING 상태)
     */
    public abstract void process(T outbox);

    protected abstract T findById(Long outboxId);

    /**
     * Outbox를 COMPLETED 상태로 변경
     * <p>
     * 파라미터로 받은 outbox는 claimPendingOutboxes 트랜잭션 종료 후 detached 상태이므로, 새 트랜잭션에서 ID로 다시 조회하여 managed 상태의 엔티티를 얻은 후 상태를
     * 변경합니다.
     */
    @Transactional
    public void markAsCompleted(
            final T outbox,
            final Instant now
    ) {
        final T managedOutbox = findById(outbox.getId());
        managedOutbox.markAsCompleted(now);
    }

    /**
     * Outbox를 실패 처리 (재시도 또는 FAILED 상태로 변경)
     * <p>
     * 파라미터로 받은 outbox는 claimPendingOutboxes 트랜잭션 종료 후 detached 상태이므로, 새 트랜잭션에서 ID로 다시 조회하여 managed 상태의 엔티티를 얻은 후 상태를
     * 변경합니다.
     */
    @Transactional
    public void markAsFailed(
            final T outbox,
            final Instant now
    ) {
        final T managedOutbox = findById(outbox.getId());
        managedOutbox.markAsFailed(now);
    }
}
