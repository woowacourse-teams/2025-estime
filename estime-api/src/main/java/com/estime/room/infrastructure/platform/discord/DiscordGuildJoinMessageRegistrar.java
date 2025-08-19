package com.estime.room.infrastructure.platform.discord;

import com.estime.room.domain.platform.PlatformMessage;
import com.estime.room.domain.platform.PlatformMessageStyle;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.events.guild.GuildJoinEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.springframework.stereotype.Component;

@Component
public class DiscordGuildJoinMessageRegistrar extends ListenerAdapter {

    @Override
    public void onGuildJoin(final GuildJoinEvent event) {
        final TextChannel channel = pickWritableChannel(event.getGuild());
        if (channel == null) {
            return;
        }

        channel.sendMessageEmbeds(
                new EmbedBuilder()
                        .setColor(PlatformMessageStyle.DEFAULT.getColor())
                        .setTitle(PlatformMessage.HELP.getTitle())
                        .setDescription(PlatformMessage.HELP.getDescription())
                        .build()
        ).queue();
    }

    private TextChannel pickWritableChannel(final Guild guild) {
        final TextChannel systemChannel = guild.getSystemChannel();
        if (systemChannel != null && systemChannel.canTalk()) {
            return systemChannel;
        }
        return guild.getTextChannels().stream()
                .filter(TextChannel::canTalk)
                .findFirst()
                .orElse(null);
    }
}
