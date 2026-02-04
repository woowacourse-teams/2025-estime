package com.estime.config;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class ExecutorConfig {

    private static final int PROCESSORS = Runtime.getRuntime().availableProcessors();

    @Value("${spring.datasource.hikari.maximum-pool-size}")
    private int hikariPoolSize;

    @Bean
    public Executor outboxCallbackExecutor() {
        final ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // DB I/O 바운드: Hikari 커넥션 풀 크기에 맞춰 설정
        final int core = Math.max(2, hikariPoolSize / 2);
        final int max = hikariPoolSize;

        executor.setCorePoolSize(core);
        executor.setMaxPoolSize(max);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("outbox-callback-");

        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);

        // 유실 불가: 큐 포화 시 호출 스레드에서 실행
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

        executor.initialize();
        return executor;
    }

    @Bean
    public Executor staleDroppableExecutor() {
        final ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // 오래된 이벤트를 버려도 되는 작업용 (예: zero payload SSE)
        final int core = Math.max(2, PROCESSORS / 4);
        final int max = Math.max(core, PROCESSORS / 2);

        executor.setCorePoolSize(core);
        executor.setMaxPoolSize(max);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("stale-droppable-");

        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(15);

        // 큐 포화 시 오래된 작업 버림
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardOldestPolicy());

        executor.initialize();
        return executor;
    }
}
