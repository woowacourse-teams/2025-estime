package com.bether.bether.connection.discord.infrastructure;

import com.bether.bether.connection.application.MessageSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import org.springframework.stereotype.Component;

@Component("DISCORD")
@RequiredArgsConstructor
@Slf4j
public class DiscordMessageSender implements MessageSender {

    private final JDA jda;

    @Override
    public void execute(final String channelId, final String message) {
        final TextChannel textChannel = jda.getTextChannelById(channelId);
        if (textChannel == null) {
            log.warn("Could not find channel with id {}", channelId);
            return;
        }
        textChannel.sendMessage(message).queue();
    }
}
