package com.bether.bether.connection.discord.application.util;

import com.bether.bether.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.bether.bether.connection.application.dto.input.ConnectedRoomCreatedMessageInput;
import com.bether.bether.connection.domain.PlatformMessage;
import com.bether.bether.connection.domain.PlatformMessageStyle;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.MessageEmbed;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import net.dv8tion.jda.api.utils.messages.MessageCreateBuilder;
import net.dv8tion.jda.api.utils.messages.MessageCreateData;
import org.springframework.stereotype.Component;

@Component
public class DiscordMessageBuilder {

    public MessageCreateData buildConnectedRoomCreateMessage(final ConnectedRoomCreateMessageInput input) {
        final PlatformMessage platformMessage = PlatformMessage.CONNECTED_ROOM_CREATE;
        final MessageEmbed embed = new EmbedBuilder()
                .setTitle(platformMessage.getTitle())
                .setColor(PlatformMessageStyle.DEFAULT.getColor())
                .build();

        return new MessageCreateBuilder()
                .setEmbeds(embed)
                .setActionRow(Button.link(input.shortcut(), platformMessage.getShortcutDescription()))
                .build();
    }

    public MessageCreateData buildConnectedRoomCreatedMessage(final ConnectedRoomCreatedMessageInput input) {
        final PlatformMessage platformMessage = PlatformMessage.CONNECTED_ROOM_CREATED;
        final String formattedDeadline = input.deadLine().format(PlatformMessageStyle.DEFAULT.getDateTimeFormatter());
        final MessageEmbed embed = new EmbedBuilder()
                .setTitle(platformMessage.getTitle())
                .setDescription(String.format("""
                        > **제목 : ** %s
                        > **마감기한 : ** %s
                        """, input.title(), formattedDeadline))
                .setColor(PlatformMessageStyle.DEFAULT.getColor())
                .build();

        return new MessageCreateBuilder()
                .setEmbeds(embed)
                .setActionRow(Button.link(input.shortcut(), platformMessage.getShortcutDescription()))
                .build();
    }
}
