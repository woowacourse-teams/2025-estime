package com.estime.event.spring;

import com.estime.event.DomainEvent;
import com.estime.event.domain.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SpringDomainEventPublisher implements DomainEventPublisher {

    private final ApplicationEventPublisher delegate;

    @Override
    public void publish(final DomainEvent event) {
        delegate.publishEvent(event);
    }
}
