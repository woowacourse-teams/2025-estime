package com.estime.event.domain;

import com.estime.event.DomainEvent;
import com.estime.event.EventPublisher;

public interface DomainEventPublisher extends EventPublisher<DomainEvent> {}
