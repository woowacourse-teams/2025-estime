package com.estime.room.domain.participant.vote.vo;

import java.time.Duration;
import java.time.LocalTime;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
@EqualsAndHashCode
public class TimeSlot {

    public static final Duration UNIT = Duration.ofMinutes(30);

    private final LocalTime startAt;

    public static TimeSlot from(final LocalTime startAt) {
        validate(startAt);
        return new TimeSlot(startAt);
    }

    private static void validate(final LocalTime startAt) {
        Objects.requireNonNull(startAt, "startAt cannot be null");

        if (startAt.getSecond() != 0 || startAt.getNano() != 0) {
            throw new IllegalArgumentException("초·나노초는 항상 0이어야 합니다: " + startAt);
        }

        final long seconds = startAt.toSecondOfDay();      // 0~86 399
        if (seconds % UNIT.getSeconds() != 0) {
            throw new IllegalArgumentException(
                    String.format("시간은 반드시 %d분 단위 경계여야 합니다: %s",
                            UNIT.toMinutes(), startAt));
        }
    }
}
