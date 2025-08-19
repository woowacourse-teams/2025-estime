package com.estime.room.infrastructure.platform.discord;

import com.estime.room.domain.platform.PlatformCommand;
import java.util.List;
import java.util.stream.Stream;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.events.session.ReadyEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.build.Commands;
import net.dv8tion.jda.api.interactions.commands.build.SlashCommandData;
import org.springframework.stereotype.Component;

@Component
public class DiscordSlashCommandRegistrar extends ListenerAdapter {

    @Override
    public void onReady(final ReadyEvent event) {
        final JDA jda = event.getJDA();
        updateCommand(jda);

        // 불필요한 추가 등록 방지
        jda.removeEventListener(this);
    }

    private void updateCommand(final JDA jda) {
        final List<SlashCommandData> commands =
                Stream.of(PlatformCommand.values())
                        .map(each -> Commands.slash(each.getValue(), each.getDescription()))
                        .toList();

        jda.updateCommands()
                .addCommands(commands)
                .queue();
    }
}
