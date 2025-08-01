package com.estime.connection.discord.config;

import com.estime.connection.discord.infrastructure.DiscordSlashCommandListener;
import com.estime.connection.discord.infrastructure.DiscordSlashCommandRegistrar;
import com.estime.connection.domain.PlatformMessage;
import lombok.RequiredArgsConstructor;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DiscordConfig {

    private final DiscordSlashCommandRegistrar registrar;
    private final DiscordSlashCommandListener listener;

    @Bean(destroyMethod = "shutdown")
    public JDA jda(@Value("${discord.bot.token}") final String token) throws InterruptedException {
        return JDABuilder.createDefault(token)
                .setActivity(Activity.playing(PlatformMessage.SERVICE_SLOGAN))
                .addEventListeners(registrar, listener)
                .build()
                .awaitReady();
    }
}
