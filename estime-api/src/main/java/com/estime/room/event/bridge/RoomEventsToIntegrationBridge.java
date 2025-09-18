package com.estime.room.event.bridge;

import com.estime.event.integration.IntegrationEventPublisher;
import com.estime.room.domain.events.ConnectedRoomCreatedDomainEvent;
import com.estime.room.event.ConnectedRoomCreatedIntegrationEvent;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class RoomEventsToIntegrationBridge {

    private final IntegrationEventPublisher integrationPublisher;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void on(final ConnectedRoomCreatedDomainEvent domainEvent) {
        integrationPublisher.publish(
                new ConnectedRoomCreatedIntegrationEvent(
                        "tttt", 1, UUID.randomUUID().toString(), domainEvent, Instant.now()));
    }
}
