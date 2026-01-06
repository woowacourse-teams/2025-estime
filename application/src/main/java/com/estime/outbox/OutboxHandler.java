package com.estime.outbox;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CompletableFuture;
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
     * Stale PROCESSING 상태의 Outbox를 복구
     * <p>
     * 서버 다운 등으로 PROCESSING 상태로 남아있는 Outbox를 PENDING 또는 FAILED로 변경합니다. STALE_THRESHOLD 이상 PROCESSING 상태인 레코드를 대상으로 합니다.
     *
     * @param now       현재 시각 (now - STALE_THRESHOLD 이전에 업데이트된 레코드를 조회)
     * @param batchSize 한 번에 처리할 Outbox 개수
     */
    @Transactional
    public abstract void recoverStaleProcessing(
            Instant now,
            int batchSize
    );

    /**
     * 실제 작업 수행 (비동기)
     * <p>
     * 이미 PROCESSING 상태인 Outbox에 대해 비즈니스 로직을 실행합니다. 외부 API 호출 등이 포함될 수 있으므로 트랜잭션 없이 실행됩니다. 비동기 처리를 위해 CompletableFuture를
     * 반환하며, 완료 시 콜백에서 상태가 업데이트됩니다.
     *
     * @param outbox 처리할 Outbox (이미 PROCESSING 상태)
     * @return 비동기 처리 결과
     */
    public abstract CompletableFuture<Void> process(T outbox);

    protected abstract T findById(Long outboxId);

    /**
     * Outbox를 COMPLETED 상태로 변경
     * <p>
     * 비동기 콜백에서 호출되므로 새 트랜잭션에서 ID로 조회하여 managed 상태의 엔티티를 얻은 후 상태를 변경합니다.
     *
     * @param outbox 완료 처리할 Outbox
     * @param now    현재 시각
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
     * 비동기 콜백에서 호출되므로 새 트랜잭션에서 ID로 조회하여 managed 상태의 엔티티를 얻은 후 상태를 변경합니다.
     *
     * @param outbox 실패 처리할 Outbox
     * @param now    현재 시각
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
