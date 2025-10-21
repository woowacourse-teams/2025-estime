package com.estime.config;

import io.micrometer.core.instrument.Meter;
import io.micrometer.core.instrument.Tag;
import io.micrometer.core.instrument.config.MeterFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MicrometerConfig {

    @Bean
    public MeterFilter sseMetricsFilter() {
        return new MeterFilter() {

            @Override
            public Meter.Id map(Meter.Id id) {
                if (id.getName().equals("http.server.requests")) {
                    String uri = id.getTag("uri");
                    if (uri != null && uri.startsWith("/api/v1/sse/")) {
                        return id.withTag(Tag.of("sse", "true"));
                    }
                }
                return id;
            }
        };
    }
}
