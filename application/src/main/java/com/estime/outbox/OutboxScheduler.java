package com.estime.outbox;

import com.estime.notification.PlatformNotificationOutboxHandler;
import com.estime.port.out.TimeProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OutboxScheduler {

    private static final int BATCH_SIZE = 100;

    private final OutboxProcessingOrchestrator orchestrator;
    private final PlatformNotificationOutboxHandler handler;
    private final TimeProvider timeProvider;

    @Scheduled(cron = "0 * * * * *") // 매 분마다 실행
    public void processOutbox() {
        orchestrator.processOutboxes(handler, timeProvider.now(), BATCH_SIZE);
    }
}
