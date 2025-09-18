package com.estime.event.integration;

import com.estime.event.DomainEvent;
import com.estime.event.EventPublisher;

public interface IntegrationEventPublisher extends EventPublisher<IntegrationEvent<? extends DomainEvent>> {
}
