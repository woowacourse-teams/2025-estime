package com.estime.datetimeslot;

import java.time.Duration;
import java.time.LocalDateTime;
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
public class DateTimeSlot {

    public static final Duration UNIT = Duration.ofMinutes(30);

    private final LocalDateTime startAt;

    public static DateTimeSlot from(final LocalDateTime startAt) {
        validate(startAt);
        return new DateTimeSlot(startAt);
    }

    private static void validate(final LocalDateTime startAt) {
        Objects.requireNonNull(startAt, "startAt cannot be null");
    }
}
