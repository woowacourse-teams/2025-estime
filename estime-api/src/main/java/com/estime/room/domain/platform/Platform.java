package com.estime.room.domain.platform;

import com.estime.common.BaseEntity;
import com.estime.common.util.Validator;
import jakarta.persistence.Column;
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
    @Column(name = "platform_type", nullable = false)
    private PlatformType platformType;

    @Column(name = "channel_id", nullable = false)
    private String channelId;

    public static Platform withoutId(final Long roomId, final PlatformType platformType, final String channelId) {
        validateNull(roomId, platformType, channelId);
        return new Platform(roomId, platformType, channelId);
    }

    private static void validateNull(final Long roomId, final PlatformType platformType, final String channelId) {
        Validator.builder()
                .add(Fields.roomId, roomId)
                .add(Fields.platformType, platformType)
                .add(Fields.channelId, channelId)
                .validateNull();
    }
}
