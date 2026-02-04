package com.estime.logging;

import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.config.ExecutorConfig;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(classes = ExecutorMdcPropagationTest.TestConfig.class)
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.datasource.hikari.maximum-pool-size=5"
})
class ExecutorMdcPropagationTest {

    @Import(ExecutorConfig.class)
    static class TestConfig {
    }

    @Autowired
    @Qualifier("outboxCallbackExecutor")
    private Executor outboxCallbackExecutor;

    @Autowired
    @Qualifier("staleDroppableExecutor")
    private Executor staleDroppableExecutor;

    @BeforeEach
    void setUp() {
        MDC.clear();
    }

    @AfterEach
    void tearDown() {
        MDC.clear();
    }

    @DisplayName("outboxCallbackExecutor: MDC 컨텍스트가 비동기 스레드로 전파된다")
    @Test
    void outboxCallbackExecutor_propagates_mdc_context() throws Exception {
        // given
        final String traceId = "test-trace-id-123";
        MDC.put(MdcKey.TRACE_ID.getKey(), traceId);

        final CountDownLatch latch = new CountDownLatch(1);
        final AtomicReference<String> childTraceId = new AtomicReference<>();

        // when
        outboxCallbackExecutor.execute(() -> {
            childTraceId.set(MDC.get(MdcKey.TRACE_ID.getKey()));
            latch.countDown();
        });

        // then
        final boolean completed = latch.await(5, TimeUnit.SECONDS);
        assertSoftly(softly -> {
            softly.assertThat(completed).isTrue();
            softly.assertThat(childTraceId.get()).isEqualTo(traceId);
        });
    }

    @DisplayName("staleDroppableExecutor: MDC 컨텍스트가 비동기 스레드로 전파된다")
    @Test
    void staleDroppableExecutor_propagates_mdc_context() throws Exception {
        // given
        final String traceId = "test-trace-id-456";
        MDC.put(MdcKey.TRACE_ID.getKey(), traceId);

        final CountDownLatch latch = new CountDownLatch(1);
        final AtomicReference<String> childTraceId = new AtomicReference<>();

        // when
        staleDroppableExecutor.execute(() -> {
            childTraceId.set(MDC.get(MdcKey.TRACE_ID.getKey()));
            latch.countDown();
        });

        // then
        final boolean completed = latch.await(5, TimeUnit.SECONDS);
        assertSoftly(softly -> {
            softly.assertThat(completed).isTrue();
            softly.assertThat(childTraceId.get()).isEqualTo(traceId);
        });
    }

    @DisplayName("비동기 작업 완료 후 자식 스레드의 MDC가 정리된다")
    @Test
    void mdc_is_cleared_after_async_task_completes() throws Exception {
        // given
        final String traceId = "test-trace-id-789";
        MDC.put(MdcKey.TRACE_ID.getKey(), traceId);

        final CountDownLatch firstLatch = new CountDownLatch(1);
        final CountDownLatch secondLatch = new CountDownLatch(1);
        final AtomicReference<String> secondTaskTraceId = new AtomicReference<>();

        // when - 첫 번째 작업 실행
        outboxCallbackExecutor.execute(firstLatch::countDown);
        firstLatch.await(5, TimeUnit.SECONDS);

        // 부모 스레드 MDC 정리 후 두 번째 작업 실행
        MDC.clear();
        outboxCallbackExecutor.execute(() -> {
            secondTaskTraceId.set(MDC.get(MdcKey.TRACE_ID.getKey()));
            secondLatch.countDown();
        });

        // then - 두 번째 작업에서는 MDC가 비어있어야 함
        final boolean completed = secondLatch.await(5, TimeUnit.SECONDS);
        assertSoftly(softly -> {
            softly.assertThat(completed).isTrue();
            softly.assertThat(secondTaskTraceId.get()).isNull();
        });
    }
}