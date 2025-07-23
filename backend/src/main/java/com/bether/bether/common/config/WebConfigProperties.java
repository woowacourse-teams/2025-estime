package com.bether.bether.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "url.origin")
public record WebConfigProperties(
        String local,
        String dev,
        String prod
) {
}
