package com.estime.logging;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = SchedulerLoggingAspectTest.TestConfig.class)
@ActiveProfiles("test")
class SchedulerLoggingAspectTest {

    @EnableAspectJAutoProxy
    static class TestConfig {

        @Bean
        public SchedulerLoggingAspect schedulerLoggingAspect() {
            return new SchedulerLoggingAspect();
        }

        @Bean
        public TestScheduler testScheduler() {
            return new TestScheduler();
        }
    }

    @Component
    static class TestScheduler {

        private final AtomicReference<String> capturedTraceId = new AtomicReference<>();

        @Scheduled(fixedRate = 1000)
        public void scheduledMethod() {
            capturedTraceId.set(MDC.get(MdcKey.TRACE_ID.getKey()));
        }

        public String getCapturedTraceId() {
            return capturedTraceId.get();
        }

        public void reset() {
            capturedTraceId.set(null);
        }
    }

    @Autowired
    private TestScheduler testScheduler;

    @BeforeEach
    void setUp() {
        MDC.clear();
        testScheduler.reset();
    }

    @AfterEach
    void tearDown() {
        MDC.clear();
    }

    @DisplayName("@Scheduled 메서드 실행 시 SCH- 접두사 traceId가 MDC에 설정된다")
    @Test
    void scheduled_method_gets_trace_id_with_sch_prefix() {
        // when
        testScheduler.scheduledMethod();

        // then
        final String traceId = testScheduler.getCapturedTraceId();
        assertSoftly(softly -> {
            softly.assertThat(traceId).isNotNull();
            softly.assertThat(traceId).startsWith("SCH-");
            softly.assertThat(traceId).hasSize(12); // "SCH-" + 8자리 UUID
        });
    }

    @DisplayName("@Scheduled 메서드 실행 후 MDC가 정리된다")
    @Test
    void mdc_is_cleared_after_scheduled_method_completes() {
        // when
        testScheduler.scheduledMethod();

        // then
        assertThat(MDC.get(MdcKey.TRACE_ID.getKey())).isNull();
    }

    @DisplayName("이미 traceId가 있으면 새로 생성하지 않는다")
    @Test
    void does_not_override_existing_trace_id() {
        // given
        final String existingTraceId = "existing-trace-id";
        MDC.put(MdcKey.TRACE_ID.getKey(), existingTraceId);

        // when
        testScheduler.scheduledMethod();

        // then
        assertThat(testScheduler.getCapturedTraceId()).isEqualTo(existingTraceId);
    }
}
