package com.bether.bether.connection.discord.infrastructure;

import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.events.session.ReadyEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DiscordSlashCommandRegistrar extends ListenerAdapter {

    // 특정 테스트용 길드(서버) 설정 (n초 후 갱신), 삭제 예정
    @Override
    public void onReady(final ReadyEvent e) {
        final Guild guild = e.getJDA().getGuildById("1393585305713512478");
        if (guild != null) {
            guild.upsertCommand("estime-create", "일정 조율 시작하기")
                    .queue();
        }
    }

//    // 글로벌 설정 (n시간 후 갱신)
//    @Override
//    public void onReady(final ReadyEvent event) {
//        final JDA jda = event.getJDA();
//        jda.upsertCommand("estime-create", "일정 조율 시작하기")
//                .queue();
//
//        // 불필요한 추가 등록 방지
//        jda.removeEventListener(this);
//    }
}
