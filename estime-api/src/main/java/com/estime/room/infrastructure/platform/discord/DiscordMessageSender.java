package com.estime.room.infrastructure.platform.discord;

import com.estime.room.domain.platform.PlatformMessage;
import com.estime.room.domain.vo.RoomSession;
import com.estime.room.infrastructure.platform.PlatformShortcutBuilder;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.utils.messages.MessageCreateData;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class DiscordMessageSender {

    private final JDA jda;
    private final DiscordMessageBuilder discordMessageBuilder;
    private final PlatformShortcutBuilder platformShortcutBuilder;

    public void sendTextMessage(final String channelId, final String message) {
        final TextChannel channel = getChannel(channelId);
        if (channel == null) {
            return;
        }

        channel.sendMessage(message).queue();
    }

    public void sendConnectedRoomCreatedMessage(
            final String channelId,
            final RoomSession session,
            final String title,
            final LocalDateTime deadline
    ) {
        final TextChannel channel = getChannel(channelId);
        if (channel == null) {
            return;
        }

        final MessageCreateData message = discordMessageBuilder.buildConnectedRoomCreatedMessage(
                platformShortcutBuilder.buildConnectedRoomUrl(session),
                title,
                deadline
        );

        sendMessage(channel, message);
    }

    public void sendReminderMessage(
            final String channelId,
            final RoomSession session,
            final String title,
            final LocalDateTime deadline
    ) {
        final TextChannel channel = getChannel(channelId);
        if (channel == null) {
            return;
        }

        final MessageCreateData message = discordMessageBuilder.buildReminderMessage(
                platformShortcutBuilder.buildConnectedRoomUrl(session),
                title,
                deadline
        );
        sendMessage(channel, message);
    }

    public void sendDeadlineAlertMessage(
            final String channelId,
            final RoomSession session,
            final String title
    ) {
        final TextChannel channel = getChannel(channelId);
        if (channel == null) {
            return;
        }

        final MessageCreateData message = discordMessageBuilder.buildDeadlineAlertMessage(
                platformShortcutBuilder.buildConnectedRoomUrl(session),
                title
        );
        sendMessage(channel, message);
    }

    private TextChannel getChannel(final String channelId) {
        final TextChannel channel = jda.getTextChannelById(channelId);
        if (channel == null) {
            log.warn("Discord channel not found: id={}", channelId);
        }
        return channel;
    }

    private void sendMessage(final TextChannel channel, final MessageCreateData message) {
        channel.sendMessage(message)
                .queue(
                        success -> log.info("Success to send, channelId:{}, message:{}",
                                channel.getId(), PlatformMessage.ROOM_CREATED.name()),
                        failure -> log.error("Fail to send, channelId:{}, message:{}, failure:{}",
                                channel.getId(), PlatformMessage.ROOM_CREATED.name(), failure.getMessage())
                );
    }
}
