package com.bether.bether.connection.config;

import com.bether.bether.connection.application.MessageSender;
import com.bether.bether.connection.discord.infrastructure.DiscordMessageSender;
import com.bether.bether.connection.domain.Platform;
import com.bether.bether.connection.slack.infrastructure.SlackMessageSender;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageSenderConfig {

    @Bean
    public Map<Platform, MessageSender> messageSenderMap(
            final DiscordMessageSender discordMessageSender,
            final SlackMessageSender slackMessageSender
    ) {
        return Map.of(
                Platform.DISCORD, discordMessageSender,
                Platform.SLACK, slackMessageSender
        );
    }
}
