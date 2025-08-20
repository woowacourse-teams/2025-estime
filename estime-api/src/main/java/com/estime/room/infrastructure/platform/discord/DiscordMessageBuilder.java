package com.estime.room.infrastructure.platform.discord;

import com.estime.room.domain.platform.PlatformMessage;
import com.estime.room.domain.platform.PlatformMessageStyle;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.MessageEmbed;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import net.dv8tion.jda.api.utils.messages.MessageCreateBuilder;
import net.dv8tion.jda.api.utils.messages.MessageCreateData;
import org.springframework.stereotype.Component;

@Component
public class DiscordMessageBuilder {

    public MessageCreateData buildConnectedRoomCreateMessage(final String shortcut) {
        final PlatformMessage platformMessage = PlatformMessage.ROOM_CREATE;
        final MessageEmbed embed = new EmbedBuilder()
                .setTitle(platformMessage.getTitle())
                .setColor(PlatformMessageStyle.DEFAULT.getColor())
                .build();

        return new MessageCreateBuilder()
                .setEmbeds(embed)
                .setActionRow(Button.link(shortcut, platformMessage.getDescription()))
                .build();
    }

    public MessageCreateData buildConnectedRoomCreatedMessage(
            final String shortcut,
            final String title,
            final DateTimeSlot deadline) {
        final PlatformMessage platformMessage = PlatformMessage.ROOM_CREATED;
        final String formattedDeadline = deadline.getStartAt()
                .format(PlatformMessageStyle.DEFAULT.getDateTimeFormatter());
        final MessageEmbed embed = new EmbedBuilder()
                .setTitle(platformMessage.getTitle())
                .setDescription(String.format("""
                        > **제목 : ** %s
                        > **마감기한 : ** %s
                        """, title, formattedDeadline))
                .setColor(PlatformMessageStyle.DEFAULT.getColor())
                .build();

        return new MessageCreateBuilder()
                .setEmbeds(embed)
                .setActionRow(Button.link(shortcut, platformMessage.getDescription()))
                .build();
    }
}
