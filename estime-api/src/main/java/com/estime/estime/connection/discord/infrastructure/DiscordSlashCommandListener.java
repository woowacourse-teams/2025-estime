package com.estime.estime.connection.discord.infrastructure;

import com.estime.estime.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.estime.estime.connection.discord.application.util.DiscordMessageBuilder;
import com.estime.estime.connection.domain.Platform;
import com.estime.estime.connection.domain.PlatformCommand;
import com.estime.estime.connection.util.ConnectionUrlBuilder;
import lombok.RequiredArgsConstructor;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.utils.messages.MessageCreateData;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DiscordSlashCommandListener extends ListenerAdapter {

    private final ConnectionUrlBuilder connectionUrlBuilder;
    private final DiscordMessageBuilder discordMessageBuilder;

    @Override
    public void onSlashCommandInteraction(final SlashCommandInteractionEvent event) {
        if (event.getName().equals(PlatformCommand.CREATE.getCommand())) {
            final String shortcut = generateConnectedRoomCreateUrl(event);
            final ConnectedRoomCreateMessageInput input = new ConnectedRoomCreateMessageInput(shortcut);
            final MessageCreateData messageData = discordMessageBuilder.buildConnectedRoomCreateMessage(input);
            event.reply(messageData)
                    .setEphemeral(true)
                    .queue();
        }
    }

    private String generateConnectedRoomCreateUrl(final SlashCommandInteractionEvent event) {
        return connectionUrlBuilder.buildConnectedRoomCreateUrl(Platform.DISCORD, event.getChannelId());
    }
}
