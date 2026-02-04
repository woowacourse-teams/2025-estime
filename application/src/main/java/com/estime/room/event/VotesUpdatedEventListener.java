package com.estime.room.event;

import com.estime.port.out.RoomEventSender;
import com.estime.room.RoomSession;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class VotesUpdatedEventListener {

    private final RoomEventSender roomEventSender;
    private final Map<RoomSession, Boolean> pendingRooms = new ConcurrentHashMap<>();

    @Async("staleDroppableExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(final VotesUpdatedEvent event) {
        final RoomSession roomSession = event.roomSession();

        if (pendingRooms.putIfAbsent(roomSession, Boolean.TRUE) != null) {
            log.debug("Skipping duplicate SSE for room: {}", roomSession);
            return;
        }

        try {
            roomEventSender.sendEvent(roomSession, event);
        } catch (final Exception e) {
            log.warn("Failed to send SSE [votes-updated]. roomSession={}", roomSession, e);
        } finally {
            pendingRooms.remove(roomSession);
        }
    }
}
