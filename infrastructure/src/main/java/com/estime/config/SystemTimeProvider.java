package com.estime.config;

import com.estime.port.out.TimeProvider;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class SystemTimeProvider implements TimeProvider {

    private final Clock clock;

    @Override
    public Instant now() {
        return clock.instant();
    }

    @Override
    public ZoneId zone() {
        return clock.getZone();
    }
}
