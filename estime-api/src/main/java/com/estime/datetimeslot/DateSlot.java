package com.estime.datetimeslot;

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
public class DateSlot {

    public static final Duration UNIT = Duration.ofDays(1);

    private final LocalDate startAt;

    public static DateSlot from(final LocalDate startAt) {
        validate(startAt);
        return new DateSlot(startAt);
    }

    private static void validate(final LocalDate startAt) {
        Objects.requireNonNull(startAt, "startAt cannot be null");
    }

    public boolean isBefore(final DateSlot other) {
        return this.startAt.isBefore(other.startAt);
    }

    public boolean isBefore(final LocalDate other) {
        return this.startAt.isBefore(other);
    }
}
