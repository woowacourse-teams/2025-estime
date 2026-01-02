package com.estime.room.platform.notification;

import com.estime.outbox.Outbox;
import com.estime.room.platform.PlatformType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class PlatformNotificationOutbox extends Outbox {

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "platform_type", nullable = false)
    private PlatformType platformType;

    @Column(name = "channel_id", nullable = false)
    private String channelId;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform_notification_type", nullable = false)
    private PlatformNotificationType platformNotificationType;

    private PlatformNotificationOutbox(
            final Long roomId,
            final PlatformType platformType,
            final String channelId,
            final PlatformNotificationType platformNotificationType,
            final Instant scheduledAt
    ) {
        super(scheduledAt);
        this.roomId = roomId;
        this.platformType = platformType;
        this.channelId = channelId;
        this.platformNotificationType = platformNotificationType;
    }

    public static PlatformNotificationOutbox of(
            final Long roomId,
            final PlatformType platformType,
            final String channelId,
            final PlatformNotificationType type,
            final Instant createdAt,
            final Instant deadlineAt
    ) {
        return new PlatformNotificationOutbox(
                roomId,
                platformType,
                channelId,
                type,
                type.scheduledAt(createdAt, deadlineAt)
        );
    }
}
