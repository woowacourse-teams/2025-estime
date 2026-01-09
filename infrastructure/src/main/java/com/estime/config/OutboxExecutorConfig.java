package com.estime.config;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class OutboxExecutorConfig {

    private static final int PROCESSORS = Runtime.getRuntime().availableProcessors();
    private static final int CORE_POOL_SIZE = PROCESSORS;
    private static final int MAX_POOL_SIZE = PROCESSORS * 2;
    private static final int QUEUE_CAPACITY = 100;
    private static final int AWAIT_TERMINATION_SECONDS = 30;

    @Bean
    public Executor outboxCallbackExecutor() {
        final ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // I/O 바운드 (DB 업데이트), DB 커넥션 풀 크기 고려
        executor.setCorePoolSize(CORE_POOL_SIZE);
        executor.setMaxPoolSize(MAX_POOL_SIZE);

        // Bounded queue: 메모리 폭주 방지
        executor.setQueueCapacity(QUEUE_CAPACITY);
        executor.setThreadNamePrefix("outbox-callback-");

        // Graceful shutdown: 종료 시 진행 중인 작업 완료 대기
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(AWAIT_TERMINATION_SECONDS);

        // CallerRunsPolicy: 큐 포화 시 호출 스레드에서 실행 → 작업 유실 없이 backpressure
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

        executor.initialize();
        return executor;
    }
}
