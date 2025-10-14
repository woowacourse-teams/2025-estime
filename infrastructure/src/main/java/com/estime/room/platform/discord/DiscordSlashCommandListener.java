package com.estime.room.platform.discord;

import com.estime.room.platform.PlatformCommand;
import com.estime.room.platform.PlatformShortcutBuilder;
import com.estime.room.platform.PlatformType;
import lombok.RequiredArgsConstructor;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.utils.messages.MessageCreateData;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DiscordSlashCommandListener extends ListenerAdapter {

    private final PlatformShortcutBuilder platformShortcutBuilder;
    private final DiscordMessageBuilder discordMessageBuilder;

    @Override
    public void onSlashCommandInteraction(final SlashCommandInteractionEvent event) {
        if (event.getName().equals(PlatformCommand.HELP.getValue())) {
            final MessageCreateData messageData = discordMessageBuilder.buildHelpMessage();
            event.reply(messageData)
                    .setEphemeral(true)
                    .queue();
        }

        if (event.getName().equals(PlatformCommand.CREATE.getValue())) {
            final String shortcut = getConnectedRoomCreateUrl(event);
            final MessageCreateData messageData = discordMessageBuilder.buildConnectedRoomCreateMessage(shortcut);
            event.reply(messageData)
                    .setEphemeral(true)
                    .queue();
        }
    }

    private String getConnectedRoomCreateUrl(final SlashCommandInteractionEvent event) {
        return platformShortcutBuilder.buildConnectedRoomCreateUrl(PlatformType.DISCORD, event.getChannelId());
    }
}
