package com.estime.connection.discord.infrastructure;

import com.estime.connection.application.MessageSender;
import com.estime.connection.application.dto.input.ConnectedRoomCreatedMessageInput;
import com.estime.connection.discord.application.util.DiscordMessageBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.utils.messages.MessageCreateData;
import org.springframework.stereotype.Component;

@Component("DISCORD")
@Slf4j
@RequiredArgsConstructor
public class DiscordMessageSender implements MessageSender {

    private final JDA jda;
    private final DiscordMessageBuilder discordMessageBuilder;

    @Override
    public void sendTextMessage(final String channelId, final String message) {
        final TextChannel channel = getChannel(channelId);
        if (channel == null) {
            return;
        }

        channel.sendMessage(message).queue();
    }

    @Override
    public void sendConnectedRoomCreatedMessage(final String channelId, final ConnectedRoomCreatedMessageInput input) {
        final TextChannel channel = getChannel(channelId);
        if (channel == null) {
            return;
        }

        final MessageCreateData message = discordMessageBuilder.buildConnectedRoomCreatedMessage(input);
        sendDiscordMessage(channel, message, "Connected room created message");
    }

    private TextChannel getChannel(final String channelId) {
        final TextChannel channel = jda.getTextChannelById(channelId);
        if (channel == null) {
            log.warn("Discord channel not found: id={}", channelId);
        }
        return channel;
    }

    private void sendDiscordMessage(
            final TextChannel channel,
            final MessageCreateData message,
            final String logPrefix
    ) {
        channel.sendMessage(message)
                .queue(
                        success -> log.info("{} sent to channel={}", logPrefix, channel.getId()),
                        failure -> log.error("Failed to send {}: {}", logPrefix, failure.getMessage(), failure)
                );
    }
}
