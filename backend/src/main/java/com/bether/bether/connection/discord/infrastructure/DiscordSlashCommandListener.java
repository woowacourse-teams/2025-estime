package com.bether.bether.connection.discord.infrastructure;

import com.bether.bether.common.config.WebConfigProperties;
import com.bether.bether.connection.domain.Platform;
import com.bether.bether.connection.domain.PlatformCommand;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.components.ActionRow;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@Slf4j
@RequiredArgsConstructor
public class DiscordSlashCommandListener extends ListenerAdapter {

    private final WebConfigProperties webConfigProperties;

    public void onSlashCommandInteraction(final SlashCommandInteractionEvent event) {
        if (event.getName().equals(PlatformCommand.CREATE.getCommand())) {
            sendCreateMessage(event);
        }
    }

    // TODO Move to DiscordMessageSender?
    private void sendCreateMessage(final SlashCommandInteractionEvent event) {
        final String shortcut = UriComponentsBuilder.fromUriString(webConfigProperties.dev())
                .queryParam("platform", Platform.DISCORD.name())
                .queryParam("channel-id", event.getChannelId())
                .build()
                .toUriString();

        event.replyComponents(
                        ActionRow.of(
                                Button.link(shortcut, "🗓️ 일정 조율 시작하기"))
                )
                .setEphemeral(true)
                .queue();
    }
}
