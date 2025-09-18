package com.estime.event.integration;

import com.estime.event.DomainEvent;
import com.estime.event.Event;
import java.time.Instant;

public interface IntegrationEvent<T extends DomainEvent> extends Event {

    String type();

    int version();

    String correlationId();

    T payload();

    Instant publishedAt();
}
