package com.estime.room.event;

import com.estime.cache.CacheNames;
import com.estime.port.out.RoomEventSender;
import com.estime.room.RoomSession;
import java.util.concurrent.Executor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * 신호를 합치지 않고 투표마다 보낸다. prod 에서 같은 방에 투표가 몰린 적이 없어 합치는 로직을
 * 뺐다(#868). 합치는 구현은 #860 에 있다.
 */
@Component
@Slf4j
public class VotesUpdatedEventListener {

    private final RoomEventSender roomEventSender;
    private final CacheManager cacheManager;
    private final Executor sseExecutor;

    public VotesUpdatedEventListener(
            final RoomEventSender roomEventSender,
            final CacheManager cacheManager,
            @Qualifier("staleDroppableExecutor") final Executor sseExecutor
    ) {
        this.roomEventSender = roomEventSender;
        this.cacheManager = cacheManager;
        this.sseExecutor = sseExecutor;
    }

    /**
     * 캐시를 비운 뒤에 신호를 보낸다. 순서가 반대면 신호를 받고 조회한 참여자가 옛 값을 받고,
     * 다음 신호가 없으면 그대로 남는다.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(final VotesUpdated event) {
        final RoomSession roomSession = event.roomSession();
        evictVoteStatistic(roomSession);
        sseExecutor.execute(() -> send(roomSession));
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

    private void send(final RoomSession roomSession) {
        try {
            roomEventSender.sendEvent(roomSession, new VotesUpdatedEvent(roomSession));
        } catch (final Exception e) {
            log.warn("Failed to send SSE [votes-updated]. roomSession={}", roomSession, e);
        }
    }
}
