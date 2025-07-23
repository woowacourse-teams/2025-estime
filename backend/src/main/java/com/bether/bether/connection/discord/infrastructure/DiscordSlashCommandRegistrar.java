package com.bether.bether.connection.discord.infrastructure;

import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.events.session.ReadyEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DiscordSlashCommandRegistrar extends ListenerAdapter {

    // 특정 길드 설정 (n초 후 갱신)
    @Override
    public void onReady(final ReadyEvent e) {
        final Guild guild = e.getJDA().getGuildById("1393585305713512478");
        log.info("guild = {}", guild);
        if (guild != null) {
            guild.upsertCommand("schedule", "스케줄 방 생성")
                    .addOption(OptionType.STRING, "room_name", "방 이름", true)
                    .addOption(OptionType.INTEGER, "max_participants", "최대 참여자 수", false)
                    .queue();
        }
    }

    // 글로벌 설정 (n시간 후 갱신)
//    @Override
//    public void onReady(final ReadyEvent event) {
//        final JDA jda = event.getJDA();
//        jda.upsertCommand("schedule", "스케줄 방을 생성합니다.")
//                .addOption(OptionType.STRING, "room_name", "방 이름", true)
//                .addOption(OptionType.INTEGER, "max_participants", "최대 참여자 수", false)
//                .queue();
//
//        event.getJDA().getGuilds().forEach(g ->
//                log.info("✔ Bot joined guild: {} / ID={}", g.getName(), g.getId())
//        );
//
//        // 불필요한 추가 등록 방지
//        jda.removeEventListener(this);
//    }
}
