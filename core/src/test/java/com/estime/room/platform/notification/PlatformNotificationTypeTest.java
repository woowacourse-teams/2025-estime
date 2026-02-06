package com.estime.room.platform.notification;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class PlatformNotificationTypeTest {

    private static final Instant CREATED_AT = Instant.now().truncatedTo(ChronoUnit.HOURS).plus(365, ChronoUnit.DAYS);
    private static final Instant DEADLINE_AT = CREATED_AT.plus(8, ChronoUnit.HOURS);

    @Nested
    @DisplayName("scheduledAt 스케줄링 정책 테스트")
    class ScheduledAtPolicyTest {

        @DisplayName("CREATION 타입은 createdAt 시간에 스케줄링된다")
        @Test
        void creation_scheduledAtCreatedAt() {
            // when
            final Instant scheduledAt = PlatformNotificationType.CREATION.scheduledAt(CREATED_AT, DEADLINE_AT);

            // then
            assertThat(scheduledAt).isEqualTo(CREATED_AT);
        }

        @DisplayName("REMINDER 타입은 deadline 1시간 전에 스케줄링된다")
        @Test
        void reminder_scheduledAtDeadlineMinusOneHour() {
            // when
            final Instant scheduledAt = PlatformNotificationType.REMINDER.scheduledAt(CREATED_AT, DEADLINE_AT);

            // then
            assertThat(scheduledAt).isEqualTo(DEADLINE_AT.minus(Duration.ofHours(1)));
        }

        @DisplayName("DEADLINE 타입은 deadline 시간에 스케줄링된다")
        @Test
        void deadline_scheduledAtDeadline() {
            // when
            final Instant scheduledAt = PlatformNotificationType.DEADLINE.scheduledAt(CREATED_AT, DEADLINE_AT);

            // then
            assertThat(scheduledAt).isEqualTo(DEADLINE_AT);
        }
    }

    @Nested
    @DisplayName("스케줄링 순서 검증")
    class ScheduleOrderTest {

        @DisplayName("CREATION < REMINDER < DEADLINE 순서로 스케줄링된다")
        @Test
        void scheduleOrder_creationBeforeReminderBeforeDeadline() {
            // when
            final Instant creationSchedule = PlatformNotificationType.CREATION.scheduledAt(CREATED_AT, DEADLINE_AT);
            final Instant reminderSchedule = PlatformNotificationType.REMINDER.scheduledAt(CREATED_AT, DEADLINE_AT);
            final Instant deadlineSchedule = PlatformNotificationType.DEADLINE.scheduledAt(CREATED_AT, DEADLINE_AT);

            // then
            assertThat(creationSchedule).isBefore(reminderSchedule);
            assertThat(reminderSchedule).isBefore(deadlineSchedule);
        }
    }
}
