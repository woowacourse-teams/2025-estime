package com.estime.connection.domain;

import com.estime.common.BaseEntity;
import com.estime.room.domain.Room;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
public class ConnectedRoom extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform", nullable = false)
    private Platform platform;

    public static ConnectedRoom withoutId(final Room room, final Platform platform) {
        validate(room, platform);
        return new ConnectedRoom(room, platform);
    }

    private static void validate(final Room room, final Platform platform) {
        Objects.requireNonNull(room, "room cannot be null");
        Objects.requireNonNull(platform, "platform cannot be null");
    }
}
