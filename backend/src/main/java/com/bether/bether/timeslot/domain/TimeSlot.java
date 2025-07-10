package com.bether.bether.timeslot.domain;

import com.bether.bether.common.BaseEntity;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class TimeSlot extends BaseEntity {

    private UUID roomSession;
    private String userName;
    private LocalDateTime startAt;  // 15분 단위 고정

    private TimeSlot(final UUID roomSession, final String userName, final LocalDateTime startAt) {
        this.roomSession = roomSession;
        this.userName = userName;
        this.startAt = startAt;
    }

    private TimeSlot(final Long id, final UUID roomSession, final String userName, final LocalDateTime startAt) {
        super(id);
        this.roomSession = roomSession;
        this.userName = userName;
        this.startAt = startAt;
    }

    public static TimeSlot withoutId(final UUID roomSession, final String userName, final LocalDateTime startAt) {
        validate(roomSession, userName, startAt);
        return new TimeSlot(roomSession, userName, startAt);
    }

    public static TimeSlot withId(final Long id, final UUID roomSession, final String userName, final LocalDateTime startAt) {
        validate(id, roomSession, userName, startAt);
        return new TimeSlot(id, roomSession, userName, startAt);
    }

    private static void validate(final Long id, final UUID roomSession, final String userName, final LocalDateTime startAt) {
        if (id == null) {
            throw new IllegalArgumentException("id cannot be null");
        }
        validate(roomSession, userName, startAt);
    }
    
    private static void validate(final UUID roomSession, final String userName, final LocalDateTime startAt) {
        if (roomSession == null || userName == null || startAt == null) {
            throw new IllegalArgumentException("roomSession and userName and startAt cannot be null");
        }
    }
}

