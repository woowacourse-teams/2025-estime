package com.estime.room.platform;

import com.estime.shared.BaseEntity;
import com.estime.shared.Validator;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class Platform extends BaseEntity {

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private PlatformType type;

    @Column(name = "channel_id", nullable = false)
    private String channelId;

    @Embedded
    private PlatformNotification notification;

    public static Platform withoutId(
            final Long roomId,
            final PlatformType platformType,
            final String channelId,
            final PlatformNotification notification
    ) {
        validateNull(roomId, platformType, channelId, notification);
        return new Platform(roomId, platformType, channelId, notification);
    }

    private static void validateNull(
            final Long roomId,
            final PlatformType platformType,
            final String channelId,
            final PlatformNotification notification) {
        Validator.builder()
                .add(Fields.roomId, roomId)
                .add(Fields.type, platformType)
                .add(Fields.channelId, channelId)
                .add(Fields.notification, notification)
                .validateNull();
    }
}
