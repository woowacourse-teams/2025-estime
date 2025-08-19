package com.estime.connection.infrastructure.discord;

import com.estime.connection.application.discord.util.DiscordMessageBuilder;
import com.estime.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.estime.connection.domain.Platform;
import com.estime.connection.domain.PlatformCommand;
import com.estime.connection.support.ConnectionUrlHelper;
import lombok.RequiredArgsConstructor;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.utils.messages.MessageCreateData;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DiscordSlashCommandListener extends ListenerAdapter {

    private final ConnectionUrlHelper connectionUrlHelper;
    private final DiscordMessageBuilder discordMessageBuilder;

    @Override
    public void onSlashCommandInteraction(final SlashCommandInteractionEvent event) {
        if (event.getName().equals(PlatformCommand.CREATE.getValue())) {
            final String shortcut = getConnectedRoomCreateUrl(event);
            final ConnectedRoomCreateMessageInput input = new ConnectedRoomCreateMessageInput(shortcut);
            final MessageCreateData messageData = discordMessageBuilder.buildConnectedRoomCreateMessage(input);
            event.reply(messageData)
                    .setEphemeral(true)
                    .queue();
        }
    }

    private String getConnectedRoomCreateUrl(final SlashCommandInteractionEvent event) {
        return connectionUrlHelper.buildConnectedRoomCreateUrl(Platform.DISCORD, event.getChannelId());
    }
}
