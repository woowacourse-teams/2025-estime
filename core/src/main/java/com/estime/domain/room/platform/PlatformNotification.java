package com.estime.domain.room.platform;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PlatformNotification {

    @Column(name = "notification_on_created", nullable = false)
    private boolean onCreated;

    @Column(name = "notification_on_remind", nullable = false)
    private boolean onRemind;

    @Column(name = "notification_on_deadline", nullable = false)
    private boolean onDeadline;

    public static PlatformNotification of(final boolean created, final boolean remind, final boolean deadline) {
        return new PlatformNotification(created, remind, deadline);
    }

    public boolean shouldNotifyFor(final PlatformNotificationType type) {
        return switch (type) {
            case PlatformNotificationType.CREATED -> onCreated;
            case PlatformNotificationType.REMIND -> onRemind;
            case PlatformNotificationType.SOLVED -> onDeadline;
        };
    }
}
