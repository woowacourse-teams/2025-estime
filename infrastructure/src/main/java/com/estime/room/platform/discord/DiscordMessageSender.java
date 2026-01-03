package com.estime.room.platform.discord;

import com.estime.port.out.PlatformMessageSender;
import com.estime.room.RoomSession;
import com.estime.room.platform.PlatformMessage;
import com.estime.room.platform.PlatformShortcutBuilder;
import com.estime.room.platform.PlatformType;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.utils.messages.MessageCreateData;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("!test")
@Component
@Slf4j
@RequiredArgsConstructor
public class DiscordMessageSender implements PlatformMessageSender {

    private final JDA jda;
    private final DiscordMessageBuilder discordMessageBuilder;
    private final PlatformShortcutBuilder platformShortcutBuilder;

    @Override
    public PlatformType getPlatformType() {
        return PlatformType.DISCORD;
    }

    @Override
    public void sendDeadlineAlertMessage(
            final String channelId,
            final RoomSession session,
            final String title
    ) {
        final TextChannel channel = getChannel(channelId);
        final MessageCreateData message = discordMessageBuilder.buildDeadlineAlertMessage(
                platformShortcutBuilder.buildConnectedRoomUrl(session),
                title
        );
        sendMessage(channel, message);
    }

    @Override
    public void sendConnectedRoomCreatedMessage(
            final String channelId,
            final RoomSession session,
            final String title,
            final LocalDateTime deadline
    ) {
        final TextChannel channel = getChannel(channelId);
        final MessageCreateData message = discordMessageBuilder.buildConnectedRoomCreatedMessage(
                platformShortcutBuilder.buildConnectedRoomUrl(session),
                title,
                deadline
        );
        sendMessage(channel, message);
    }

    @Override
    public void sendReminderMessage(
            final String channelId,
            final RoomSession session,
            final String title,
            final LocalDateTime deadline
    ) {
        final TextChannel channel = getChannel(channelId);
        final MessageCreateData message = discordMessageBuilder.buildReminderMessage(
                platformShortcutBuilder.buildConnectedRoomUrl(session),
                title,
                deadline
        );
        sendMessage(channel, message);
    }

    private TextChannel getChannel(final String channelId) {
        final TextChannel channel = jda.getTextChannelById(channelId);
        if (channel == null) {
            throw new IllegalStateException("Discord channel not found: id=" + channelId);
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
