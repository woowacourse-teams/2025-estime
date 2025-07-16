package com.bether.bether.discord.application.service;

import lombok.RequiredArgsConstructor;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DiscordService {

    private final JDA jda;

    public void sendMessage(final String channelId, final String message) {
        final TextChannel textChannel = jda.getTextChannelById(channelId);
        if (textChannel != null) {
            textChannel.sendMessage(message).queue();
        }
    }
}
