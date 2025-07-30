package com.estime.estime.connection.config;

import com.estime.estime.connection.application.MessageSender;
import com.estime.estime.connection.discord.infrastructure.DiscordMessageSender;
import com.estime.estime.connection.domain.Platform;
import com.estime.estime.connection.slack.infrastructure.SlackMessageSender;
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
