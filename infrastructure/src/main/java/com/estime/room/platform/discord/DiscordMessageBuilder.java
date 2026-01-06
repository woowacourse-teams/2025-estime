package com.estime.room.platform.discord;

import com.estime.room.platform.PlatformMessage;
import com.estime.room.platform.PlatformMessageStyle;
import java.time.LocalDateTime;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.MessageEmbed;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import net.dv8tion.jda.api.utils.messages.MessageCreateBuilder;
import net.dv8tion.jda.api.utils.messages.MessageCreateData;
import org.springframework.stereotype.Component;

@Component
public class DiscordMessageBuilder {

    public MessageCreateData buildHelpMessage() {
        final PlatformMessage platformMessage = PlatformMessage.HELP;

        final MessageEmbed embed = new EmbedBuilder()
                .setTitle(platformMessage.getTitleWithEmoji())
                .setDescription(platformMessage.getDescription())
                .setColor(PlatformMessageStyle.DEFAULT.getColor())
                .build();

        final String creditsShortcut = "https://estime.today/credits";
        return new MessageCreateBuilder()
                .setEmbeds(embed)
                .setActionRow(Button.link(creditsShortcut, "아인슈타임을 만든 사람들"))
                .build();
    }

    public MessageCreateData buildStartMessage(final String roomCreateShortcut) {
        final PlatformMessage platformMessage = PlatformMessage.ROOM_START;
        final MessageEmbed embed = new EmbedBuilder()
                .setTitle(platformMessage.getTitleWithEmoji())
                .setColor(PlatformMessageStyle.DEFAULT.getColor())
                .build();

        return new MessageCreateBuilder()
                .setEmbeds(embed)
                .setActionRow(Button.link(roomCreateShortcut, platformMessage.getDescriptionWithEmoji()))
                .build();
    }

    public MessageCreateData buildCreationMessage(
            final String shortcut,
            final String title,
            final LocalDateTime deadline
    ) {
        final PlatformMessage platformMessage = PlatformMessage.ROOM_CREATION;
        final String formattedDeadline = deadline
                .format(PlatformMessageStyle.DEFAULT.getDateTimeFormatter());
        final MessageEmbed embed = new EmbedBuilder()
                .setTitle(platformMessage.getTitleWithEmoji())
                .setDescription(String.format("""
                        > **제목 : ** %s
                        > **마감기한 : ** %s
                        """, title, formattedDeadline))
                .setColor(PlatformMessageStyle.DEFAULT.getColor())
                .build();

        return new MessageCreateBuilder()
                .setEmbeds(embed)
                .setActionRow(Button.link(shortcut, platformMessage.getDescriptionWithEmoji()))
                .build();
    }

    public MessageCreateData buildReminderMessage(
            final String shortcut,
            final String title,
            final LocalDateTime deadline
    ) {
        final PlatformMessage platformMessage = PlatformMessage.ROOM_REMINDER;
        final String formattedDeadline = deadline
                .format(PlatformMessageStyle.DEFAULT.getDateTimeFormatter());

        final MessageEmbed embed = new EmbedBuilder()
                .setTitle(platformMessage.getTitleWithEmoji())
                .setDescription(String.format("""
                        > **제목 : ** %s
                        > **마감기한 : ** %s
                        > 일정 조율 마감이 한 시간 남았어요!
                        """, title, formattedDeadline))
                .setColor(PlatformMessageStyle.DEFAULT.getColor())
                .build();

        return new MessageCreateBuilder()
                .setEmbeds(embed)
                .setActionRow(Button.link(shortcut, platformMessage.getDescriptionWithEmoji()))
                .build();
    }

    public MessageCreateData buildDeadlineMessage(
            final String shortcut,
            final String title
    ) {
        final PlatformMessage platformMessage = PlatformMessage.ROOM_DEADLINE;

        final MessageEmbed embed = new EmbedBuilder()
                .setTitle(platformMessage.getTitleWithEmoji())
                .setDescription(String.format("""
                        > **제목 : ** %s
                        """, title))
                .setColor(PlatformMessageStyle.DEFAULT.getColor())
                .build();

        return new MessageCreateBuilder()
                .setEmbeds(embed)
                .setActionRow(Button.link(shortcut, platformMessage.getDescriptionWithEmoji()))
                .build();
    }
}
