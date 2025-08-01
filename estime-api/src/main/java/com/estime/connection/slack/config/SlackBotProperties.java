package com.estime.connection.slack.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "slack.bot")
public record SlackBotProperties(
        String token
) {
}
