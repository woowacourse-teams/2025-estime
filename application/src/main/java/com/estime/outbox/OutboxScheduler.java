package com.estime.outbox;

import com.estime.room.notification.PlatformNotificationOutboxHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OutboxScheduler {

    private static final int BATCH_SIZE = 100;

    private final OutboxProcessingOrchestrator orchestrator;
    private final PlatformNotificationOutboxHandler handler;

    @Scheduled(cron = "0 * * * * *") // 매 분 0초에 실행
    public void processOutbox() {
        orchestrator.processOutboxes(handler, BATCH_SIZE);
    }

    @EventListener(ApplicationReadyEvent.class) // 서버 시작 시 + 10분마다 실행
    @Scheduled(cron = "0 */10 * * * *")
    public void recoverStaleOutbox() {
        orchestrator.recoverStaleOutboxes(handler, BATCH_SIZE);
    }
}
