package com.estime.room.platform.notification;

import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.outbox.OutboxStatus;
import com.estime.room.platform.PlatformType;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class PlatformNotificationOutboxTest {

    private static final Instant NOW = Instant.now().truncatedTo(ChronoUnit.HOURS).plus(365, ChronoUnit.DAYS);
    private static final Instant CREATED_AT = NOW;
    private static final Instant DEADLINE_AT = NOW.plus(8, ChronoUnit.HOURS);

    private static final Long ROOM_ID = 1L;
    private static final PlatformType PLATFORM_TYPE = PlatformType.DISCORD;
    private static final String CHANNEL_ID = "test-channel-123";

    @Nested
    @DisplayName("of() 팩토리 메서드 테스트")
    class FactoryMethodTest {

        @DisplayName("CREATION 타입 생성 시 scheduledAt은 createdAt과 동일하다")
        @Test
        void of_creationType_scheduledAtEqualsCreatedAt() {
            // when
            final PlatformNotificationOutbox outbox = PlatformNotificationOutbox.of(
                    ROOM_ID,
                    PLATFORM_TYPE,
                    CHANNEL_ID,
                    PlatformNotificationType.CREATION,
                    CREATED_AT,
                    DEADLINE_AT,
                    NOW
            );

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(CREATED_AT);
                softly.assertThat(outbox.getPlatformNotificationType()).isEqualTo(PlatformNotificationType.CREATION);
            });
        }

        @DisplayName("REMINDER 타입 생성 시 scheduledAt은 deadlineAt - 1시간이다")
        @Test
        void of_reminderType_scheduledAtEqualsDeadlineMinusOneHour() {
            // when
            final PlatformNotificationOutbox outbox = PlatformNotificationOutbox.of(
                    ROOM_ID,
                    PLATFORM_TYPE,
                    CHANNEL_ID,
                    PlatformNotificationType.REMINDER,
                    CREATED_AT,
                    DEADLINE_AT,
                    NOW
            );

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(DEADLINE_AT.minus(Duration.ofHours(1)));
                softly.assertThat(outbox.getPlatformNotificationType()).isEqualTo(PlatformNotificationType.REMINDER);
            });
        }

        @DisplayName("DEADLINE 타입 생성 시 scheduledAt은 deadlineAt과 동일하다")
        @Test
        void of_deadlineType_scheduledAtEqualsDeadline() {
            // when
            final PlatformNotificationOutbox outbox = PlatformNotificationOutbox.of(
                    ROOM_ID,
                    PLATFORM_TYPE,
                    CHANNEL_ID,
                    PlatformNotificationType.DEADLINE,
                    CREATED_AT,
                    DEADLINE_AT,
                    NOW
            );

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getScheduledAt()).isEqualTo(DEADLINE_AT);
                softly.assertThat(outbox.getPlatformNotificationType()).isEqualTo(PlatformNotificationType.DEADLINE);
            });
        }

        @DisplayName("생성 시 모든 필드가 정상적으로 설정된다")
        @Test
        void of_allFieldsSetCorrectly() {
            // when
            final PlatformNotificationOutbox outbox = PlatformNotificationOutbox.of(
                    ROOM_ID,
                    PLATFORM_TYPE,
                    CHANNEL_ID,
                    PlatformNotificationType.CREATION,
                    CREATED_AT,
                    DEADLINE_AT,
                    NOW
            );

            // then
            assertSoftly(softly -> {
                softly.assertThat(outbox.getRoomId()).isEqualTo(ROOM_ID);
                softly.assertThat(outbox.getPlatformType()).isEqualTo(PLATFORM_TYPE);
                softly.assertThat(outbox.getChannelId()).isEqualTo(CHANNEL_ID);
                softly.assertThat(outbox.getPlatformNotificationType()).isEqualTo(PlatformNotificationType.CREATION);
                softly.assertThat(outbox.getStatus()).isEqualTo(OutboxStatus.PENDING);
                softly.assertThat(outbox.getRetryCount()).isEqualTo(0);
                softly.assertThat(outbox.getUpdatedAt()).isEqualTo(NOW);
            });
        }
    }
}
