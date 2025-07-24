package com.bether.bether.connection.discord.config;

import com.bether.bether.connection.discord.infrastructure.DiscordSlashCommandListener;
import com.bether.bether.connection.discord.infrastructure.DiscordSlashCommandRegistrar;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import net.dv8tion.jda.api.JDA;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DiscordJdaInitializer {

    private final JDA jda;
    private final DiscordSlashCommandRegistrar registrar;
    private final DiscordSlashCommandListener listener;

    @PostConstruct
    public void register() {
        jda.addEventListener(registrar, listener);
    }
}
