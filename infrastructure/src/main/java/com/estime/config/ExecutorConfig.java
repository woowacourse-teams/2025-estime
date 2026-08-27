package com.estime.config;

import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskDecorator;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
public class ExecutorConfig {

    private static final int PROCESSORS = Runtime.getRuntime().availableProcessors();
    private static final int SCHEDULED_TASK_COUNT = 3;
    private static final TaskDecorator MDC_TASK_DECORATOR = runnable -> {
        final Map<String, String> contextMap = MDC.getCopyOfContextMap();
        return () -> {
            try {
                if (contextMap != null) {
                    MDC.setContextMap(contextMap);
                }
                runnable.run();
            } finally {
                MDC.clear();
            }
        };
    };

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
        executor.setTaskDecorator(MDC_TASK_DECORATOR);

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
        executor.setTaskDecorator(MDC_TASK_DECORATOR);

        executor.initialize();
        return executor;
    }

    /**
     * {@code @Scheduled} 가 쓰는 스케줄러.
     *
     * <p>지정하지 않으면 스프링이 스레드 하나짜리로 만들어 모든 주기 작업이 그 하나를
     * 나눠 쓴다. {@code fixedDelay} 는 직전 실행이 끝난 뒤부터 재므로, 매 분 도는
     * Outbox 배치가 스레드를 잡고 있는 동안 투표 신호 flush 는 실행되지 못하고 그만큼
     * 지연이 밀린다.
     *
     * <p>{@code @Scheduled} 메서드 수만큼 준다. 늘릴 때 이 값도 같이 본다.
     *
     * <p>스케줄러 스레드는 오래 잡지 않는 것이 전제다. SSE 전송처럼 시간이 걸리는 일은
     * {@link #staleDroppableExecutor()} 로 넘겨야 다음 주기가 밀리지 않는다.
     */
    @Bean
    public TaskScheduler taskScheduler() {
        final ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();

        scheduler.setPoolSize(SCHEDULED_TASK_COUNT);
        scheduler.setThreadNamePrefix("scheduled-");

        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(30);

        scheduler.initialize();
        return scheduler;
    }
}
