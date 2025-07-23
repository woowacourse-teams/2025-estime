package com.bether.bether.connection.config;

import com.bether.bether.connection.application.MessageSender;
import com.bether.bether.connection.discord.infrastructure.DiscordMessageSender;
import com.bether.bether.connection.domain.Platform;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageSenderConfig {

    @Bean
    public Map<Platform, MessageSender> messageSenderMap(
            final DiscordMessageSender discord
            // TODO SLACK
    ) {
        return Map.of(
                Platform.DISCORD, discord
        );
    }
}
