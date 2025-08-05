package com.estime.connection.config;

import com.estime.connection.application.MessageSender;
import com.estime.connection.infrastructure.discord.DiscordMessageSender;
import com.estime.connection.domain.Platform;
import com.estime.connection.infrastructure.slack.SlackMessageSender;
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
