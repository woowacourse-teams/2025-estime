package com.estime.room.domain.vo;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ToString
@EqualsAndHashCode
public class DateTimeSlot implements Comparable<DateTimeSlot> {

    public static final Duration UNIT = Duration.ofMinutes(30);
    private final LocalDateTime startAt;

    public static DateTimeSlot from(final LocalDateTime startAt) {
        validate(startAt);
        return new DateTimeSlot(startAt);
    }

    private static void validate(final LocalDateTime startAt) {
        Objects.requireNonNull(startAt, "startAt cannot be null");

        if (startAt.getMinute() != 0 && startAt.getMinute() != UNIT.toMinutes()) {
            throw new IllegalArgumentException(
                    "DateTimeSlot must be set in %d-minute intervals".formatted(UNIT.toMinutes()));
        }
    }

    public boolean isBefore(final LocalDateTime other) {
        return startAt.isBefore(other);
    }

    @Override
    public int compareTo(final DateTimeSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
