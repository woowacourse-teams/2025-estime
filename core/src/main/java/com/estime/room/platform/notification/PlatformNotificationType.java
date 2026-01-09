package com.estime.room.platform.notification;

import java.time.Duration;
import java.time.Instant;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformNotificationType {
    CREATION(
            "방 생성",
            (createdAt, deadlineAt) -> createdAt
    ),
    REMINDER(
            "투표 독려",
            (createdAt, deadlineAt) -> deadlineAt.minus(Duration.ofHours(1))

    ),
    DEADLINE(
            "투표 마감",
            (createdAt, deadlineAt) -> deadlineAt
    );

    private final String description;
    private final SchedulePolicy scheduler;

    public Instant scheduledAt(final Instant createdAt, final Instant deadlineAt) {
        return scheduler.apply(createdAt, deadlineAt);
    }

    @FunctionalInterface
    interface SchedulePolicy {
        Instant apply(Instant createdAt, Instant deadlineAt);
    }
}
