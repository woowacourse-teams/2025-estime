package com.estime.room.platform.notification;

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

    @Column(name = "notification_on_creation", nullable = false)
    private boolean onCreation;

    @Column(name = "notification_on_reminder", nullable = false)
    private boolean onReminder;

    @Column(name = "notification_on_deadline", nullable = false)
    private boolean onDeadline;

    public static PlatformNotification of(final boolean creation, final boolean reminder, final boolean deadline) {
        return new PlatformNotification(creation, reminder, deadline);
    }

    public boolean shouldNotifyFor(final PlatformNotificationType type) {
        return switch (type) {
            case PlatformNotificationType.CREATION -> onCreation;
            case PlatformNotificationType.REMINDER -> onReminder;
            case PlatformNotificationType.DEADLINE -> onDeadline;
        };
    }
}
