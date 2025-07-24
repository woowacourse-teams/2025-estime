package com.bether.bether.connection.discord.config;

import com.bether.bether.connection.domain.PlatformMessage;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DiscordConfig {

    @Bean(destroyMethod = "shutdown")
    public JDA jda(@Value("${discord.bot.token}") String token) throws InterruptedException {
        return JDABuilder.createDefault(token)
                .setActivity(Activity.playing(PlatformMessage.SERVICE_SLOGAN))
                .build()
                .awaitReady();
    }
}
