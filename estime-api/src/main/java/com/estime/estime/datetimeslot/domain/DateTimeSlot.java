package com.estime.estime.datetimeslot.domain;

import com.estime.estime.common.BaseEntity;
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
public class DateTimeSlot extends BaseEntity {

    public static final Duration UNIT = Duration.ofMinutes(30);

    private Long roomId;
    private String userName;
    private LocalDateTime startAt;

    public static DateTimeSlot withoutId(final Long roomId, final String userName, final LocalDateTime startAt) {
        validate(roomId, userName, startAt);
        return new DateTimeSlot(roomId, userName, startAt);
    }

    private static void validate(final Long roomId, final String userName, final LocalDateTime startAt) {
        if (roomId == null || userName == null || startAt == null) {
            throw new IllegalArgumentException("roomId and userName and startAt cannot be null");
        }
    }
}
