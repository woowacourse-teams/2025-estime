package com.estime.estime.connection.discord.infrastructure;

import com.estime.estime.connection.domain.PlatformCommand;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.events.session.ReadyEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.build.Commands;
import org.springframework.stereotype.Component;

@Component
public class DiscordSlashCommandRegistrar extends ListenerAdapter {

    // 글로벌 설정 (n시간 후 갱신)
    @Override
    public void onReady(final ReadyEvent event) {
        final JDA jda = event.getJDA();
        jda.updateCommands()
                .addCommands(
                        Commands.slash("estime-create", PlatformCommand.CREATE.getDescription())
                )
                .queue();

        // 불필요한 추가 등록 방지
        jda.removeEventListener(this);
    }

//    // 특정 길드 설정 (n초 후 갱신)
//    @Override
//    public void onReady(final ReadyEvent e) {
//        final Guild guild = e.getJDA().getGuildById("1393585305713512478");
//        if (guild != null) {
//            guild.upsertCommand("estime-create", PlatformCommand.CREATE.getDescription())
//                    .queue();
//        }
//    }
}
