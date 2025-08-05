package com.estime.connection.config.slack;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "slack.bot")
public record SlackBotProperties(
        String token
) {
}
