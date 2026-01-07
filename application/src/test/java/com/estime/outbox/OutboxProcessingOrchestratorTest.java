package com.estime.outbox;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

import com.estime.port.out.TimeProvider;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OutboxProcessingOrchestratorTest {

    private static final Instant NOW = Instant.now().truncatedTo(ChronoUnit.HOURS).plus(365, ChronoUnit.DAYS);
    private static final int BATCH_SIZE = 100;

    @Mock
    private TimeProvider timeProvider;

    @Mock
    private OutboxHandler<TestOutbox> handler;

    private OutboxProcessingOrchestrator orchestrator;

    /**
     * 테스트용 Outbox 구현체
     */
    static class TestOutbox extends Outbox {
        private final Long id;

        TestOutbox(final Long id, final Instant scheduledAt, final Instant now) {
            super(scheduledAt, now);
            this.id = id;
        }

        @Override
        public Long getId() {
            return id;
        }
    }

    @BeforeEach
    void setUp() {
        // 동기 executor 사용 (테스트에서 콜백 즉시 실행)
        final Executor syncExecutor = Runnable::run;
        orchestrator = new OutboxProcessingOrchestrator(timeProvider, syncExecutor);
        given(timeProvider.now()).willReturn(NOW);
    }

    @Nested
    @DisplayName("processOutboxes 테스트")
    class ProcessOutboxesTest {

        @DisplayName("정상 흐름: claim → process 성공 → markAsCompleted 호출")
        @Test
        void processOutboxes_successFlow_callsMarkAsCompleted() {
            // given
            final TestOutbox outbox = new TestOutbox(1L, NOW.minus(5, ChronoUnit.MINUTES), NOW);
            given(handler.claimPendingOutboxes(NOW, BATCH_SIZE)).willReturn(List.of(outbox));
            given(handler.process(outbox)).willReturn(CompletableFuture.completedFuture(null));

            // when
            orchestrator.processOutboxes(handler, BATCH_SIZE);

            // then
            then(handler).should().claimPendingOutboxes(NOW, BATCH_SIZE);
            then(handler).should().process(outbox);
            then(handler).should().markAsCompleted(outbox, NOW);
            then(handler).should(never()).markAsFailed(any(), any());
        }

        @DisplayName("실패 흐름: claim → process 실패 → markAsFailed 호출")
        @Test
        void processOutboxes_failureFlow_callsMarkAsFailed() {
            // given
            final TestOutbox outbox = new TestOutbox(1L, NOW.minus(5, ChronoUnit.MINUTES), NOW);
            given(handler.claimPendingOutboxes(NOW, BATCH_SIZE)).willReturn(List.of(outbox));
            given(handler.process(outbox)).willReturn(
                    CompletableFuture.failedFuture(new RuntimeException("External API failed"))
            );

            // when
            orchestrator.processOutboxes(handler, BATCH_SIZE);

            // then
            then(handler).should().claimPendingOutboxes(NOW, BATCH_SIZE);
            then(handler).should().process(outbox);
            then(handler).should().markAsFailed(outbox, NOW);
            then(handler).should(never()).markAsCompleted(any(), any());
        }

        @DisplayName("다중 처리: 여러 outbox가 각각 독립적으로 처리된다")
        @Test
        void processOutboxes_multipleOutboxes_processedIndependently() {
            // given
            final TestOutbox outbox1 = new TestOutbox(1L, NOW.minus(10, ChronoUnit.MINUTES), NOW);
            final TestOutbox outbox2 = new TestOutbox(2L, NOW.minus(5, ChronoUnit.MINUTES), NOW);
            given(handler.claimPendingOutboxes(NOW, BATCH_SIZE)).willReturn(List.of(outbox1, outbox2));
            given(handler.process(outbox1)).willReturn(CompletableFuture.completedFuture(null));
            given(handler.process(outbox2)).willReturn(
                    CompletableFuture.failedFuture(new RuntimeException("Failed"))
            );

            // when
            orchestrator.processOutboxes(handler, BATCH_SIZE);

            // then
            then(handler).should().markAsCompleted(outbox1, NOW);
            then(handler).should().markAsFailed(outbox2, NOW);
        }

        @DisplayName("빈 결과: claim 결과가 없으면 process 호출 안함")
        @Test
        void processOutboxes_emptyClaimResult_noProcessCall() {
            // given
            given(handler.claimPendingOutboxes(NOW, BATCH_SIZE)).willReturn(List.of());

            // when
            orchestrator.processOutboxes(handler, BATCH_SIZE);

            // then
            then(handler).should().claimPendingOutboxes(NOW, BATCH_SIZE);
            then(handler).should(never()).process(any());
        }

        @DisplayName("claim 예외: 예외 발생 시 로깅만 하고 예외 전파 안함")
        @Test
        void processOutboxes_claimException_logsAndDoesNotPropagate() {
            // given
            given(handler.claimPendingOutboxes(NOW, BATCH_SIZE))
                    .willThrow(new RuntimeException("DB connection failed"));

            // when & then
            assertThatCode(() -> orchestrator.processOutboxes(handler, BATCH_SIZE))
                    .doesNotThrowAnyException();

            then(handler).should(never()).process(any());
        }

        @DisplayName("markAsCompleted 예외: 예외 발생 시 로깅만 하고 예외 전파 안함")
        @Test
        void processOutboxes_markAsCompletedException_logsAndDoesNotPropagate() {
            // given
            final TestOutbox outbox = new TestOutbox(1L, NOW.minus(5, ChronoUnit.MINUTES), NOW);
            given(handler.claimPendingOutboxes(NOW, BATCH_SIZE)).willReturn(List.of(outbox));
            given(handler.process(outbox)).willReturn(CompletableFuture.completedFuture(null));
            willThrow(new RuntimeException("DB update failed"))
                    .given(handler).markAsCompleted(outbox, NOW);

            // when & then
            assertThatCode(() -> orchestrator.processOutboxes(handler, BATCH_SIZE))
                    .doesNotThrowAnyException();
        }

        @DisplayName("markAsFailed 예외: 예외 발생 시 로깅만 하고 예외 전파 안함")
        @Test
        void processOutboxes_markAsFailedException_logsAndDoesNotPropagate() {
            // given
            final TestOutbox outbox = new TestOutbox(1L, NOW.minus(5, ChronoUnit.MINUTES), NOW);
            given(handler.claimPendingOutboxes(NOW, BATCH_SIZE)).willReturn(List.of(outbox));
            given(handler.process(outbox)).willReturn(
                    CompletableFuture.failedFuture(new RuntimeException("External API failed"))
            );
            willThrow(new RuntimeException("DB update failed"))
                    .given(handler).markAsFailed(outbox, NOW);

            // when & then
            assertThatCode(() -> orchestrator.processOutboxes(handler, BATCH_SIZE))
                    .doesNotThrowAnyException();
        }

        @DisplayName("콜백 예외 격리: 한 outbox의 markAsCompleted 예외가 다른 outbox 처리에 영향 없음")
        @Test
        void processOutboxes_callbackExceptionIsolation_otherOutboxesProcessed() {
            // given
            final TestOutbox outbox1 = new TestOutbox(1L, NOW.minus(10, ChronoUnit.MINUTES), NOW);
            final TestOutbox outbox2 = new TestOutbox(2L, NOW.minus(5, ChronoUnit.MINUTES), NOW);
            given(handler.claimPendingOutboxes(NOW, BATCH_SIZE)).willReturn(List.of(outbox1, outbox2));
            given(handler.process(outbox1)).willReturn(CompletableFuture.completedFuture(null));
            given(handler.process(outbox2)).willReturn(CompletableFuture.completedFuture(null));
            willThrow(new RuntimeException("DB update failed"))
                    .given(handler).markAsCompleted(outbox1, NOW);

            // when
            orchestrator.processOutboxes(handler, BATCH_SIZE);

            // then: outbox2의 markAsCompleted는 정상 호출됨
            then(handler).should(times(2)).process(any());
            then(handler).should().markAsCompleted(outbox2, NOW);
        }
    }

    @Nested
    @DisplayName("recoverStaleOutboxes 테스트")
    class RecoverStaleOutboxesTest {

        @DisplayName("정상 흐름: recoverStaleProcessing 호출")
        @Test
        void recoverStaleOutboxes_normalFlow_callsRecoverStaleProcessing() {
            // when
            orchestrator.recoverStaleOutboxes(handler, BATCH_SIZE);

            // then
            then(handler).should().recoverStaleProcessing(NOW, BATCH_SIZE);
        }

        @DisplayName("예외 처리: 예외 발생 시 로깅만 하고 예외 전파 안함")
        @Test
        void recoverStaleOutboxes_exception_logsAndDoesNotPropagate() {
            // given
            willThrow(new RuntimeException("DB connection failed"))
                    .given(handler).recoverStaleProcessing(NOW, BATCH_SIZE);

            // when & then
            assertThatCode(() -> orchestrator.recoverStaleOutboxes(handler, BATCH_SIZE))
                    .doesNotThrowAnyException();
        }
    }
}
