package com.estime.connection.discord.infrastructure;

import com.estime.common.config.WebConfigProperties;
import com.estime.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.estime.connection.discord.application.util.DiscordMessageBuilder;
import com.estime.connection.domain.Platform;
import com.estime.connection.domain.PlatformCommand;
import lombok.RequiredArgsConstructor;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.utils.messages.MessageCreateData;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class DiscordSlashCommandListener extends ListenerAdapter {

    private final WebConfigProperties webConfigProperties;
    private final DiscordMessageBuilder discordMessageBuilder;

    @Override
    public void onSlashCommandInteraction(final SlashCommandInteractionEvent event) {
        if (event.getName().equals(PlatformCommand.CREATE.getCommand())) {
            final ConnectedRoomCreateMessageInput input = new ConnectedRoomCreateMessageInput(
                    // TODO refactor with UTIL class
                    UriComponentsBuilder.fromUriString(webConfigProperties.dev())
                            .queryParam("platform", Platform.DISCORD.name())
                            .queryParam("channelId", event.getChannelId())
                            .build()
                            .toUriString()
            );

            final MessageCreateData messageData = discordMessageBuilder.buildConnectedRoomCreateMessage(input);
            event.reply(messageData)
                    .setEphemeral(true)
                    .queue();
        }
    }
}
