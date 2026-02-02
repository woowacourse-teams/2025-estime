package com.estime.room.event;

import com.estime.port.out.RoomEventSender;
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

    @Async("staleDroppableExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(final VotesUpdatedEvent event) {
        try {
            roomEventSender.sendEvent(event.roomSession(), event);
        } catch (final Exception e) {
            log.warn("Failed to send SSE [votes-updated]. roomSession={}", event.roomSession(), e);
        }
    }
}
