package com.estime.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "url.origin")
public record ClientOriginProperties(
        String prod,
        String dev,
        String local
) {

    public String[] urls() {
        return new String[]{prod, dev, local};
    }
}
