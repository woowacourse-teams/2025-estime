package com.bether.bether.discord.config;

import com.bether.bether.discord.application.service.DiscordSlashCommandListener;
import com.bether.bether.discord.application.service.DiscordSlashCommandRegistrar;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DiscordConfig {

    @Bean(destroyMethod = "shutdown")
    public JDA jda(@Value("${discord.bot.token}") final String token,
                   final DiscordSlashCommandRegistrar registrar,
                   final DiscordSlashCommandListener listener) throws Exception {
        return JDABuilder.createDefault(token)
                .addEventListeners(listener)
                .addEventListeners(registrar)
                .build()
                .awaitReady();
    }
}
