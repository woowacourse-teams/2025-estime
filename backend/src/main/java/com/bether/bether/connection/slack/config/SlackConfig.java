package com.bether.bether.connection.slack.config;

import com.slack.api.Slack;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@EnableConfigurationProperties(SlackBotProperties.class)
@Configuration
public class SlackConfig {

    @Bean
    public RestClient slackRestClient() {
        return RestClient.builder()
                .baseUrl("https://slack.com/api/")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Bean
    public Slack slack() {
        return Slack.getInstance();
    }
}
