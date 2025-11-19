package com.estime.room.platform;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class PlatformNotificationTest {

    @DisplayName("PlatformNotification.of() - 알림 설정 객체를 생성한다")
    @Test
    void of() {
        // when
        final PlatformNotification notification = PlatformNotification.of(true, false, true);

        // then
        assertThat(notification.isOnCreated()).isTrue();
        assertThat(notification.isOnRemind()).isFalse();
        assertThat(notification.isOnDeadline()).isTrue();
    }

    @DisplayName("shouldNotifyFor() - CREATED 타입에 대해 알림 여부를 반환한다")
    @Test
    void shouldNotifyFor_created() {
        // given
        final PlatformNotification notification = PlatformNotification.of(true, false, false);

        // when & then
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.CREATED)).isTrue();
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.REMIND)).isFalse();
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.SOLVED)).isFalse();
    }

    @DisplayName("shouldNotifyFor() - REMIND 타입에 대해 알림 여부를 반환한다")
    @Test
    void shouldNotifyFor_remind() {
        // given
        final PlatformNotification notification = PlatformNotification.of(false, true, false);

        // when & then
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.CREATED)).isFalse();
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.REMIND)).isTrue();
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.SOLVED)).isFalse();
    }

    @DisplayName("shouldNotifyFor() - SOLVED 타입에 대해 알림 여부를 반환한다")
    @Test
    void shouldNotifyFor_solved() {
        // given
        final PlatformNotification notification = PlatformNotification.of(false, false, true);

        // when & then
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.CREATED)).isFalse();
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.REMIND)).isFalse();
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.SOLVED)).isTrue();
    }

    @DisplayName("shouldNotifyFor() - 모든 알림이 활성화된 경우")
    @Test
    void shouldNotifyFor_allEnabled() {
        // given
        final PlatformNotification notification = PlatformNotification.of(true, true, true);

        // when & then
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.CREATED)).isTrue();
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.REMIND)).isTrue();
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.SOLVED)).isTrue();
    }

    @DisplayName("shouldNotifyFor() - 모든 알림이 비활성화된 경우")
    @Test
    void shouldNotifyFor_allDisabled() {
        // given
        final PlatformNotification notification = PlatformNotification.of(false, false, false);

        // when & then
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.CREATED)).isFalse();
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.REMIND)).isFalse();
        assertThat(notification.shouldNotifyFor(PlatformNotificationType.SOLVED)).isFalse();
    }
}
