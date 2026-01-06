package com.estime.room.platform.discord;

import com.estime.port.out.PlatformMessageSender;
import com.estime.room.RoomSession;
import com.estime.room.platform.PlatformShortcutBuilder;
import com.estime.room.platform.PlatformType;
import com.estime.room.platform.notification.PlatformNotificationType;
import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;
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
    public CompletableFuture<Void> send(
            final PlatformNotificationType type,
            final String channelId,
            final RoomSession session,
            final String title,
            final LocalDateTime deadline
    ) {
        final TextChannel channel = getChannel(channelId);
        final String roomUrl = platformShortcutBuilder.buildConnectedRoomUrl(session);

        final MessageCreateData message = switch (type) {
            case CREATION -> discordMessageBuilder.buildConnectedRoomCreatedMessage(roomUrl, title, deadline);
            case REMINDER -> discordMessageBuilder.buildReminderMessage(roomUrl, title, deadline);
            case DEADLINE -> discordMessageBuilder.buildDeadlineAlertMessage(roomUrl, title);
        };

        return sendMessage(channel, message);
    }

    private TextChannel getChannel(final String channelId) {
        final TextChannel channel = jda.getTextChannelById(channelId);
        if (channel == null) {
            throw new IllegalStateException("Discord channel not found: id=" + channelId);
        }
        return channel;
    }

    private CompletableFuture<Void> sendMessage(
            final TextChannel channel,
            final MessageCreateData message
    ) {
        final CompletableFuture<Void> future = new CompletableFuture<>();
        channel.sendMessage(message)
                .queue(
                        success -> future.complete(null),
                        future::completeExceptionally
                );
        return future;
    }
}
