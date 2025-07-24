package com.bether.bether.connection.discord.infrastructure;

import com.bether.bether.connection.application.MessageSender;
import com.bether.bether.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.bether.bether.connection.application.dto.input.ConnectedRoomCreatedMessageInput;
import com.bether.bether.connection.discord.application.util.DiscordMessageBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
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

    public void sendConnectedRoomCreateEphemeralMessage(
            final SlashCommandInteractionEvent event,
            final ConnectedRoomCreateMessageInput input
    ) {
        final MessageCreateData messageData = discordMessageBuilder.buildConnectedRoomCreateMessage(input);
        event.reply(messageData)
                .setEphemeral(true)
                .queue();
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
