package com.estime.connection.infrastructure.discord;

import com.estime.connection.domain.PlatformMessageStyle;
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
                                .setTitle("아인슈타임을 호출했습니다! 👋")
                                .setDescription("`/도움말` 로 사용법을 확인해 보세요!")
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
