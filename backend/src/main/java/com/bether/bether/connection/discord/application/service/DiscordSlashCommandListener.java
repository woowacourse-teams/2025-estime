package com.bether.bether.connection.discord.application.service;

import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DiscordSlashCommandListener extends ListenerAdapter {

    @Override
    public void onSlashCommandInteraction(final SlashCommandInteractionEvent event) {
        if (!event.getName().equals("schedule")) {
            return;
        }

        final String room = Objects.requireNonNull(event.getOption("room_name")).getAsString();

        log.info("""
                        ========= SlashCommandInteractionEvent =========
                        name               : {}
                        guild              : {}
                        channel            : {}   (id={})
                        user               : {}
                        member             : {}
                        commandString      : {}
                        fullCommandName    : {}
                        subcommandGroup    : {}
                        subcommandName     : {}
                        raw event          : {}
                        ==============================================
                        """,
                event.getName(),
                event.getGuild(),
                event.getChannel(), // TODO channel을 이용해서 room과 연결
                event.getChannelId(),
                event.getUser(),
                event.getMember(),
                event.getCommandString(),
                event.getFullCommandName(),
                event.getSubcommandGroup(),
                event.getSubcommandName(),
                event
        );

        event.reply("🗓️  **" + room + "** 일정 조율해요!").setEphemeral(true).queue();
    }
}
