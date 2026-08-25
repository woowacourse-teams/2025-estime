package com.estime.room.event;

import com.estime.port.out.RoomEventSender;
import com.estime.room.RoomSession;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicReference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
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
 */
@Component
@Slf4j
public class VotesUpdatedEventListener {

    private static final long FLUSH_INTERVAL_MS = 100L;

    private final RoomEventSender roomEventSender;
    private final Executor sseExecutor;
    private final AtomicReference<Set<RoomSession>> dirtyRooms =
            new AtomicReference<>(ConcurrentHashMap.newKeySet());

    public VotesUpdatedEventListener(
            final RoomEventSender roomEventSender,
            @Qualifier("staleDroppableExecutor") final Executor sseExecutor
    ) {
        this.roomEventSender = roomEventSender;
        this.sseExecutor = sseExecutor;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(final VotesUpdatedEvent event) {
        dirtyRooms.get().add(event.roomSession());
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
