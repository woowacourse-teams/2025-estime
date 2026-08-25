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
 * <p>신호에 값을 싣지 않으므로 멱등하다. 한 방에 변경이 열 번 몰려도 "가서 최신을 가져와라"
 * 를 한 번 보내면 결과가 같다.
 *
 * <p>표시는 커밋 직후 동기로 세우고 전송만 비동기로 넘긴다. 표시까지 비동기였다면 실행기가
 * 작업을 버릴 때 신호가 사라진다.
 *
 * <p>주기마다 집합을 통째로 교체한 뒤 전송한다. 순서가 반대면 전송 중에 커밋된 변경이 세운
 * 표시를 지워 그 변경이 묻힌다. 이 순서에서 최악은 신호가 한 번 더 나가는 것뿐이다.
 *
 * <p>받는 것은 서버 내부 사실 {@link VotesUpdated} 이고, 보낼 때 브라우저용 페이로드
 * {@link VotesUpdatedEvent} 를 만든다. 합치기 때문에 둘은 개수가 다르다: 변경 열 번에
 * 신호 한 번이라 발행된 객체를 그대로 흘려보낼 수 없다.
 *
 * <p>투표 통계 캐시도 여기서 비운다. 서비스에 붙이던 {@code @CacheEvict} 는 캐시 인터셉터와
 * 트랜잭션 인터셉터의 우선순위가 둘 다 최저라 커밋 앞뒤 어느 쪽에서 도는지 정해져 있지 않았다.
 * 커밋 전에 비우면 그 틈에 읽은 옛 값이 캐시에 다시 앉아 만료까지 낡은 값이 나간다.
 * 커밋 뒤인 이 자리에서 비우면 순서가 확정된다: 커밋 → 무효화 → 신호 → 조회.
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
