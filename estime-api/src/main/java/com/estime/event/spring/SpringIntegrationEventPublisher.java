package com.estime.event.spring;

import com.estime.event.DomainEvent;
import com.estime.event.integration.IntegrationEvent;
import com.estime.event.integration.IntegrationEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SpringIntegrationEventPublisher implements IntegrationEventPublisher {

    private final ApplicationEventPublisher delegate;

    @Override
    public void publish(final IntegrationEvent<? extends DomainEvent> event) {
        delegate.publishEvent(event);
    }
}
