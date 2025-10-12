package com.estime.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "url.origin")
public record ClientOriginProperties(
        String client
) {
}

