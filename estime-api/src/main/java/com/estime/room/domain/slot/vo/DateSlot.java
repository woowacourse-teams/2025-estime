package com.estime.room.domain.slot.vo;

import java.time.Duration;
import java.time.LocalDate;
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
public class DateSlot implements Comparable<DateSlot> {

    public static final Duration UNIT = Duration.ofDays(1);

    private final LocalDate startAt;

    public static DateSlot from(final LocalDate startAt) {
        validate(startAt);
        return new DateSlot(startAt);
    }

    private static void validate(final LocalDate startAt) {
        Objects.requireNonNull(startAt, "startAt cannot be null");
        if (startAt.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("dateSlot cannot be past date: " + startAt);
        }
    }

    @Override
    public int compareTo(final DateSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
