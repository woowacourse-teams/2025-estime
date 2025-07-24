package com.bether.bether.connection.discord.infrastructure;

import com.bether.bether.connection.application.MessageSender;
import com.bether.bether.connection.application.dto.output.OutboundMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import org.springframework.stereotype.Component;


@Component("DISCORD")
@RequiredArgsConstructor
@Slf4j
public class DiscordMessageSender implements MessageSender {

    private final JDA jda;

    @Override
    public void execute(final String channelId, final OutboundMessage message) {
        final TextChannel channel = jda.getTextChannelById(channelId);
        if (channel == null) {
            log.warn("Could not find channel with id {}", channelId);
            return;
        }

        final EmbedBuilder eb = new EmbedBuilder()
                .setDescription(message.text())
                .setColor(0x3AA55D);

        channel.sendMessageEmbeds(eb.build())
                .addActionRow(Button.link(message.shortcut(),
                        "🗓️ 일정 조율 참여하기")) // TODO refactor with ShortCut(title, url) record
                .queue();
    }
}
