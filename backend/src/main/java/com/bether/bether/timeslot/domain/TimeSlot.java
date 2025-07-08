package com.bether.bether.timeslot.domain;

import com.bether.bether.common.BaseEntity;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class TimeSlot extends BaseEntity {

    // 15분 단위 고정
    private LocalDateTime startAt;

    private TimeSlot(final LocalDateTime startAt) {
        this.startAt = startAt;
    }

    private TimeSlot(final Long id, final LocalDateTime startAt) {
        super(id);
        this.startAt = startAt;
    }

    public static TimeSlot withoutId(final LocalDateTime startAt) {
        validate(startAt);
        return new TimeSlot(startAt);
    }

    public static TimeSlot withId(final Long id, final LocalDateTime startAt) {
        validate(id, startAt);
        return new TimeSlot(id, startAt);
    }

    private static void validate(final LocalDateTime startAt) {
        if (startAt == null) {
            throw new IllegalArgumentException("startAt cannot be null");
        }
    }

    private static void validate(final Long id, final LocalDateTime startAt) {
        if (id == null || startAt == null) {
            throw new IllegalArgumentException("id and startAt cannot be null");
        }
    }
}

