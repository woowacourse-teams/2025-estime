package com.estime.room.platform;

import static org.assertj.core.api.Assertions.assertThat;

import com.estime.room.platform.notification.PlatformNotification;
import com.estime.room.platform.notification.PlatformNotificationOutbox;
import com.estime.room.platform.notification.PlatformNotificationType;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class PlatformTest {

    private static final Long ROOM_ID = 1L;
    private static final String CHANNEL_ID = "channel-1";
    private static final Instant CREATED_AT = Instant.parse("2025-11-01T00:00:00Z");
    private static final Instant DEADLINE_AT = Instant.parse("2025-11-02T00:00:00Z");
    private static final Instant NOW = Instant.parse("2025-11-01T00:00:00Z");

    @DisplayName("createNotificationOutboxes() - 활성화된 알림 타입에 대해서만 Outbox를 생성한다")
    @Test
    void createNotificationOutboxes_filters_by_notification_settings() {
        // given
        final Platform platform = createPlatform(true, false, true);

        // when
        final List<PlatformNotificationOutbox> outboxes =
                platform.createNotificationOutboxes(CREATED_AT, DEADLINE_AT, NOW);

        // then
        assertThat(outboxes).hasSize(2);
        assertThat(outboxes).extracting(PlatformNotificationOutbox::getPlatformNotificationType)
                .containsExactly(PlatformNotificationType.CREATION, PlatformNotificationType.DEADLINE);
    }

    @DisplayName("createNotificationOutboxes() - 모든 알림이 활성화된 경우 3개 Outbox를 생성한다")
    @Test
    void createNotificationOutboxes_all_enabled() {
        // given
        final Platform platform = createPlatform(true, true, true);

        // when
        final List<PlatformNotificationOutbox> outboxes =
                platform.createNotificationOutboxes(CREATED_AT, DEADLINE_AT, NOW);

        // then
        assertThat(outboxes).hasSize(3);
    }

    @DisplayName("createNotificationOutboxes() - 모든 알림이 비활성화된 경우 빈 리스트를 반환한다")
    @Test
    void createNotificationOutboxes_none_enabled() {
        // given
        final Platform platform = createPlatform(false, false, false);

        // when
        final List<PlatformNotificationOutbox> outboxes =
                platform.createNotificationOutboxes(CREATED_AT, DEADLINE_AT, NOW);

        // then
        assertThat(outboxes).isEmpty();
    }

    private Platform createPlatform(
            final boolean onCreation,
            final boolean onReminder,
            final boolean onDeadline
    ) {
        return Platform.withoutId(
                ROOM_ID, PlatformType.DISCORD, CHANNEL_ID,
                PlatformNotification.of(onCreation, onReminder, onDeadline));
    }
}
