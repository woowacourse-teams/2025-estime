package com.estime.room.event;

import com.estime.cache.CacheNames;
import com.estime.port.out.RoomEventSender;
import com.estime.room.RoomSession;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicReference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * 투표 변경 신호를 방 단위로 모아 주기마다 한 번씩 보낸다.
 *
 * <p>목록에 담는 일은 커밋 직후 동기로 한다. 전송용 실행기가 큐 포화 시 작업을 버리므로
 * 담는 일까지 비동기면 신호가 사라진다.
 *
 * <p>{@link #flush()} 는 목록을 먼저 가져오고 나서 보낸다. 순서가 반대면 보내는 동안
 * 커밋된 변경이 담아 둔 항목을 지워 그 변경이 묻힌다.
 */
@Component
@Slf4j
public class VotesUpdatedEventListener {

    private static final long FLUSH_INTERVAL_MS = 100L;

    private final RoomEventSender roomEventSender;
    private final CacheManager cacheManager;
    private final Executor sseExecutor;
    private final AtomicReference<Set<RoomSession>> dirtyRooms =
            new AtomicReference<>(ConcurrentHashMap.newKeySet());

    public VotesUpdatedEventListener(
            final RoomEventSender roomEventSender,
            final CacheManager cacheManager,
            @Qualifier("staleDroppableExecutor") final Executor sseExecutor
    ) {
        this.roomEventSender = roomEventSender;
        this.cacheManager = cacheManager;
        this.sseExecutor = sseExecutor;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(final VotesUpdated event) {
        final RoomSession roomSession = event.roomSession();
        evictVoteStatistic(roomSession);
        dirtyRooms.get().add(roomSession);
    }

    /**
     * 서비스의 {@code @CacheEvict} 를 여기로 옮겼다. 캐시와 트랜잭션 프록시는 기본 우선순위가
     * 같아 커밋 앞뒤 어느 쪽에서 도는지 정해지지 않는데, 커밋 전에 비우면 그 틈에 읽은 옛 값이
     * 다시 앉는다.
     */
    private void evictVoteStatistic(final RoomSession roomSession) {
        final Cache cache = cacheManager.getCache(CacheNames.VOTE_STATISTIC);
        if (cache != null) {
            cache.evict(roomSession);
        }
    }

    @Scheduled(fixedDelay = FLUSH_INTERVAL_MS)
    public void flush() {
        final Set<RoomSession> batch = dirtyRooms.getAndSet(ConcurrentHashMap.newKeySet());
        batch.forEach(roomSession -> sseExecutor.execute(() -> send(roomSession)));
    }

    private void send(final RoomSession roomSession) {
        try {
            roomEventSender.sendEvent(roomSession, new VotesUpdatedEvent(roomSession));
        } catch (final Exception e) {
            log.warn("Failed to send SSE [votes-updated]. roomSession={}", roomSession, e);
        }
    }
}
