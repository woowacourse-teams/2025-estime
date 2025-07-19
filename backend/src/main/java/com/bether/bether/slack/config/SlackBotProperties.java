package com.bether.bether.slack.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "slack.bot")
@Getter
@Setter
public class SlackBotProperties {

    private String token;
    private String channelId;
    private String webhookUrl;
}
