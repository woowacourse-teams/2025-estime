package com.estime.outbox;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.outbox.exception.InvalidOutboxStateException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class OutboxTest {

    private static final Instant NOW = Instant.now().truncatedTo(ChronoUnit.HOURS).plus(365, ChronoUnit.DAYS);

    /**
     * 특정 retryCount를 가진 Outbox 생성 (테스트 헬퍼) 실패를 반복하여 원하는 retryCount에 도달
     */
    private TestOutbox createOutboxWithRetryCount(final int targetRetryCount) {
        final TestOutbox outbox = new TestOutbox(NOW, NOW);
        for (int i = 0; i < targetRetryCount; i++) {
            outbox.markAsProcessing(NOW);
            outbox.markAsFailed(NOW);
        }
        return outbox;
    }

    /**
     * 테스트용 concrete 클래스 (Outbox는 abstract)
     */
    static class TestOutbox extends Outbox {
        TestOutbox(final Instant scheduledAt, final Instant now) {
            super(scheduledAt, now);
        }
    }

    @Nested
    @DisplayName("생성자 테스트")
    class ConstructorTest {

        @DisplayName("새 Outbox 생성 시 PENDING 상태, retryCount=0, updatedAt이 설정된다")
        @Test
        void constructor_initializesWithPendingStatus() {
            // given
            final Instant scheduledAt = NOW.plus(1, ChronoUnit.HOURS);

            // when
            final TestOutbox outbox = new TestOutbox(scheduledAt, NOW);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(outbox.getRetryCount()).isEqualTo(0);
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(scheduledAt);
                softly.assertThat(outbox.getUpdatedAt()).isEqualTo(NOW);
            });
        }
    }

    @Nested
    @DisplayName("상태 전이 테스트")
    class StateTransitionTest {

        @DisplayName("PENDING 상태에서 markAsProcessing 호출 시 PROCESSING으로 변경된다")
        @Test
        void markAsProcessing_fromPending_success() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);
            final Instant processingTime = NOW.plus(1, ChronoUnit.MINUTES);

            // when
            outbox.markAsProcessing(processingTime);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.PROCESSING);
                softly.assertThat(outbox.getUpdatedAt()).isEqualTo(processingTime);
            });
        }

        @DisplayName("PROCESSING 상태에서 markAsProcessing 호출 시 예외가 발생한다")
        @Test
        void markAsProcessing_fromProcessing_throwsException() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);
            outbox.markAsProcessing(NOW);

            // when & then
            assertThatThrownBy(() -> outbox.markAsProcessing(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }

        @DisplayName("COMPLETED 상태에서 markAsProcessing 호출 시 예외가 발생한다")
        @Test
        void markAsProcessing_fromCompleted_throwsException() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);
            outbox.markAsProcessing(NOW);
            outbox.markAsCompleted(NOW);

            // when & then
            assertThatThrownBy(() -> outbox.markAsProcessing(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }

        @DisplayName("FAILED 상태에서 markAsProcessing 호출 시 예외가 발생한다")
        @Test
        void markAsProcessing_fromFailed_throwsException() {
            // given
            final TestOutbox outbox = createOutboxWithRetryCount(4);
            outbox.markAsProcessing(NOW);
            outbox.markAsFailed(NOW); // 5번째 실패 → FAILED

            // when & then
            assertThatThrownBy(() -> outbox.markAsProcessing(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }

        @DisplayName("PROCESSING 상태에서 markAsCompleted 호출 시 COMPLETED로 변경된다")
        @Test
        void markAsCompleted_fromProcessing_success() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);
            outbox.markAsProcessing(NOW);
            final Instant completedTime = NOW.plus(1, ChronoUnit.MINUTES);

            // when
            outbox.markAsCompleted(completedTime);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.COMPLETED);
                softly.assertThat(outbox.getUpdatedAt()).isEqualTo(completedTime);
            });
        }

        @DisplayName("PENDING 상태에서 markAsCompleted 호출 시 예외가 발생한다")
        @Test
        void markAsCompleted_fromPending_throwsException() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);

            // when & then
            assertThatThrownBy(() -> outbox.markAsCompleted(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }

        @DisplayName("COMPLETED 상태에서 markAsCompleted 호출 시 예외가 발생한다")
        @Test
        void markAsCompleted_fromCompleted_throwsException() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);
            outbox.markAsProcessing(NOW);
            outbox.markAsCompleted(NOW);

            // when & then
            assertThatThrownBy(() -> outbox.markAsCompleted(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }

        @DisplayName("FAILED 상태에서 markAsCompleted 호출 시 예외가 발생한다")
        @Test
        void markAsCompleted_fromFailed_throwsException() {
            // given
            final TestOutbox outbox = createOutboxWithRetryCount(4);
            outbox.markAsProcessing(NOW);
            outbox.markAsFailed(NOW); // 5번째 실패 → FAILED

            // when & then
            assertThatThrownBy(() -> outbox.markAsCompleted(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }
    }

    @Nested
    @DisplayName("재시도 로직 테스트 (Exponential Backoff)")
    class RetryLogicTest {

        @DisplayName("첫 번째 실패 시 retryCount가 1이 되고 1분 후 재시도 스케줄링된다")
        @Test
        void markAsFailed_firstFailure_schedulesRetryIn1Minute() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);
            outbox.markAsProcessing(NOW);
            final Instant failedTime = NOW.plus(1, ChronoUnit.MINUTES);

            // when
            outbox.markAsFailed(failedTime);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(outbox.getRetryCount()).isEqualTo(1);
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(failedTime.plus(1, ChronoUnit.MINUTES));
                softly.assertThat(outbox.getUpdatedAt()).isEqualTo(failedTime);
            });
        }

        @DisplayName("두 번째 실패 시 retryCount가 2가 되고 2분 후 재시도 스케줄링된다")
        @Test
        void markAsFailed_secondFailure_schedulesRetryIn2Minutes() {
            // given
            final TestOutbox outbox = createOutboxWithRetryCount(1);
            outbox.markAsProcessing(NOW);
            final Instant failedTime = NOW.plus(1, ChronoUnit.MINUTES);

            // when
            outbox.markAsFailed(failedTime);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(outbox.getRetryCount()).isEqualTo(2);
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(failedTime.plus(2, ChronoUnit.MINUTES));
            });
        }

        @DisplayName("세 번째 실패 시 retryCount가 3이 되고 4분 후 재시도 스케줄링된다")
        @Test
        void markAsFailed_thirdFailure_schedulesRetryIn4Minutes() {
            // given
            final TestOutbox outbox = createOutboxWithRetryCount(2);
            outbox.markAsProcessing(NOW);
            final Instant failedTime = NOW.plus(1, ChronoUnit.MINUTES);

            // when
            outbox.markAsFailed(failedTime);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(outbox.getRetryCount()).isEqualTo(3);
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(failedTime.plus(4, ChronoUnit.MINUTES));
            });
        }

        @DisplayName("네 번째 실패 시 retryCount가 4가 되고 8분 후 재시도 스케줄링된다")
        @Test
        void markAsFailed_fourthFailure_schedulesRetryIn8Minutes() {
            // given
            final TestOutbox outbox = createOutboxWithRetryCount(3);
            outbox.markAsProcessing(NOW);
            final Instant failedTime = NOW.plus(1, ChronoUnit.MINUTES);

            // when
            outbox.markAsFailed(failedTime);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(outbox.getRetryCount()).isEqualTo(4);
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(failedTime.plus(8, ChronoUnit.MINUTES));
            });
        }

        @DisplayName("다섯 번째 실패 시 retryCount가 5가 되고 FAILED 상태가 된다")
        @Test
        void markAsFailed_fifthFailure_statusBecomesFailed() {
            // given
            final TestOutbox outbox = createOutboxWithRetryCount(4);
            outbox.markAsProcessing(NOW);
            final Instant originalScheduledAt = outbox.getScheduledAt();
            final Instant failedTime = NOW.plus(1, ChronoUnit.MINUTES);

            // when
            outbox.markAsFailed(failedTime);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.FAILED);
                softly.assertThat(outbox.getRetryCount()).isEqualTo(5);
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(originalScheduledAt); // 변경되지 않음
                softly.assertThat(outbox.getUpdatedAt()).isEqualTo(failedTime);
            });
        }
    }

    @Nested
    @DisplayName("Stale 복구 테스트")
    class StaleRecoveryTest {

        @DisplayName("PROCESSING 상태에서 recoverFromStale 호출 시 markAsFailed가 호출되어 retryCount가 증가한다")
        @Test
        void recoverFromStale_fromProcessing_callsMarkAsFailed() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);
            outbox.markAsProcessing(NOW);
            final Instant recoverTime = NOW.plus(15, ChronoUnit.MINUTES);

            // when
            outbox.recoverFromStale(recoverTime);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(outbox.getRetryCount()).isEqualTo(1);
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(recoverTime.plus(1, ChronoUnit.MINUTES));
                softly.assertThat(outbox.getUpdatedAt()).isEqualTo(recoverTime);
            });
        }

        @DisplayName("PENDING 상태에서 recoverFromStale 호출 시 예외가 발생한다")
        @Test
        void recoverFromStale_fromPending_throwsException() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);

            // when & then
            assertThatThrownBy(() -> outbox.recoverFromStale(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }

        @DisplayName("retryCount가 4인 상태에서 recoverFromStale 호출 시 FAILED 상태가 되고 scheduledAt은 불변이다")
        @Test
        void recoverFromStale_maxRetriesReached_statusBecomesFailed_scheduledAtUnchanged() {
            // given
            final TestOutbox outbox = createOutboxWithRetryCount(4);
            outbox.markAsProcessing(NOW);
            final Instant originalScheduledAt = outbox.getScheduledAt();
            final Instant recoverTime = NOW.plus(15, ChronoUnit.MINUTES);

            // when
            outbox.recoverFromStale(recoverTime);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.FAILED);
                softly.assertThat(outbox.getRetryCount()).isEqualTo(5);
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(originalScheduledAt); // scheduledAt 불변
                softly.assertThat(outbox.getUpdatedAt()).isEqualTo(recoverTime);
            });
        }

        @DisplayName("COMPLETED 상태에서 recoverFromStale 호출 시 예외가 발생한다")
        @Test
        void recoverFromStale_fromCompleted_throwsException() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);
            outbox.markAsProcessing(NOW);
            outbox.markAsCompleted(NOW);

            // when & then
            assertThatThrownBy(() -> outbox.recoverFromStale(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }

        @DisplayName("FAILED 상태에서 recoverFromStale 호출 시 예외가 발생한다")
        @Test
        void recoverFromStale_fromFailed_throwsException() {
            // given
            final TestOutbox outbox = createOutboxWithRetryCount(4);
            outbox.markAsProcessing(NOW);
            outbox.markAsFailed(NOW); // 5번째 실패 → FAILED

            // when & then
            assertThatThrownBy(() -> outbox.recoverFromStale(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }
    }

    @Nested
    @DisplayName("markAsFailed 상태 전제조건 테스트")
    class MarkAsFailedPreconditionTest {

        @DisplayName("PROCESSING 상태에서 markAsFailed 호출 시 성공한다")
        @Test
        void markAsFailed_fromProcessing_success() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);
            outbox.markAsProcessing(NOW);

            // when
            outbox.markAsFailed(NOW);

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getRetryCount()).isEqualTo(1);
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.PENDING);
            });
        }

        @DisplayName("PENDING 상태에서 markAsFailed 호출 시 예외가 발생한다")
        @Test
        void markAsFailed_fromPending_throwsException() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);

            // when & then
            assertThatThrownBy(() -> outbox.markAsFailed(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }

        @DisplayName("COMPLETED 상태에서 markAsFailed 호출 시 예외가 발생한다")
        @Test
        void markAsFailed_fromCompleted_throwsException() {
            // given
            final TestOutbox outbox = new TestOutbox(NOW, NOW);
            outbox.markAsProcessing(NOW);
            outbox.markAsCompleted(NOW);

            // when & then
            assertThatThrownBy(() -> outbox.markAsFailed(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }

        @DisplayName("FAILED 상태에서 markAsFailed 호출 시 예외가 발생한다")
        @Test
        void markAsFailed_fromFailed_throwsException() {
            // given
            final TestOutbox outbox = createOutboxWithRetryCount(4);
            outbox.markAsProcessing(NOW);
            outbox.markAsFailed(NOW); // 5번째 실패 → FAILED

            // when & then
            assertThatThrownBy(() -> outbox.markAsFailed(NOW))
                    .isInstanceOf(InvalidOutboxStateException.class);
        }
    }
}
