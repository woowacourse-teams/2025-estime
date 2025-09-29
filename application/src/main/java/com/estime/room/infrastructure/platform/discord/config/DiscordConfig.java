package com.estime.room.infrastructure.platform.discord.config;

import com.estime.domain.room.platform.PlatformMessage;
import com.estime.room.infrastructure.platform.discord.DiscordGuildJoinMessageRegistrar;
import com.estime.room.infrastructure.platform.discord.DiscordSlashCommandListener;
import com.estime.room.infrastructure.platform.discord.DiscordSlashCommandRegistrar;
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

    private final DiscordSlashCommandRegistrar commandRegistrar;
    private final DiscordSlashCommandListener commandListener;
    private final DiscordGuildJoinMessageRegistrar guildJoinMessageRegistrar;

    @Bean(destroyMethod = "shutdown")
    public JDA jda(@Value("${discord.bot.token}") final String token) throws InterruptedException {
        return JDABuilder.createDefault(token)
                .setActivity(Activity.playing(PlatformMessage.SERVICE_SLOGAN))
                .addEventListeners(commandRegistrar, commandListener, guildJoinMessageRegistrar)
                .build()
                .awaitReady();
    }
}
