package com.estime.room.event;

import com.estime.event.integration.IntegrationEvent;
import com.estime.room.domain.events.ConnectedRoomCreatedDomainEvent;
import java.time.Instant;

public record ConnectedRoomCreatedIntegrationEvent(
        String type,
        int version,
        String correlationId,
        ConnectedRoomCreatedDomainEvent payload,
        Instant publishedAt
) implements IntegrationEvent<ConnectedRoomCreatedDomainEvent> {}
