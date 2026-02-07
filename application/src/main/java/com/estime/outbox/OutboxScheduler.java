package com.estime.outbox;

import com.estime.room.notification.PlatformNotificationOutboxHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OutboxScheduler {

    private static final int BATCH_SIZE = 100;

    private final OutboxProcessingOrchestrator orchestrator;
    private final PlatformNotificationOutboxHandler platformNotificationOutboxHandler;

    @Scheduled(cron = "0 * * * * *") // 매 분 0초에 실행
    public void processOutbox() {
        orchestrator.processOutboxes(platformNotificationOutboxHandler, BATCH_SIZE);
    }

    @Scheduled(initialDelay = 0) // 서버 시작 즉시
    @Scheduled(cron = "0 */10 * * * *") // 10분마다
    public void recoverStaleOutbox() {
        orchestrator.recoverStaleOutboxes(platformNotificationOutboxHandler, BATCH_SIZE);
    }
}
