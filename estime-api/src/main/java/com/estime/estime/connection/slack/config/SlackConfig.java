package com.estime.estime.connection.slack.config;

import com.slack.api.Slack;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@EnableConfigurationProperties(SlackBotProperties.class)
@Configuration
public class SlackConfig {

    @Bean
    public Slack slack() {
        return Slack.getInstance();
    }
}
