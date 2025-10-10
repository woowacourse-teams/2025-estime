package com.estime.config;

import com.estime.shared.config.ClientOriginProvider;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "url.origin")
public record ClientOriginProperties(
        String client
) implements ClientOriginProvider {

    @Override
    public String getOrigin() {
        return client;
    }
}