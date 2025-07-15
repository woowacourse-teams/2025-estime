package com.bether.bether.timeslot.domain;

import com.bether.bether.common.BaseEntity;
import jakarta.persistence.Entity;
import java.time.LocalDateTime;
import java.util.UUID;
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

    private UUID roomSession;
    private String userName;
    private LocalDateTime startAt;  // 15분 단위 고정

    public static TimeSlot withoutId(final UUID roomSession, final String userName, final LocalDateTime startAt) {
        validate(roomSession, userName, startAt);
        return new TimeSlot(roomSession, userName, startAt);
    }

    private static void validate(final UUID roomSession, final String userName, final LocalDateTime startAt) {
        if (roomSession == null || userName == null || startAt == null) {
            throw new IllegalArgumentException("roomSession and userName and startAt cannot be null");
        }
    }
}

