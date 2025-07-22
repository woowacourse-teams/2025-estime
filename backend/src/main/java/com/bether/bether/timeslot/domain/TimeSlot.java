package com.bether.bether.timeslot.domain;

import com.bether.bether.common.BaseEntity;
import jakarta.persistence.Entity;
import java.time.Duration;
import java.time.LocalDateTime;
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
public class TimeSlot extends BaseEntity {

    public static final Duration UNIT = Duration.ofMinutes(30);

    private Long roomId;
    private String userName;
    private LocalDateTime startAt;

    public static TimeSlot withoutId(final Long roomId, final String userName, final LocalDateTime startAt) {
        validate(roomId, userName, startAt);
        return new TimeSlot(roomId, userName, startAt);
    }

    private static void validate(final Long roomId, final String userName, final LocalDateTime startAt) {
        if (roomId == null || userName == null || startAt == null) {
            throw new IllegalArgumentException("roomId and userName and startAt cannot be null");
        }
    }
}
