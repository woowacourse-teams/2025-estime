package com.estime.room.domain.slot.vo;

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
public class TimeSlot implements Comparable<TimeSlot> {

    public static final Duration UNIT = Duration.ofMinutes(30);

    private final LocalTime startAt;

    public static TimeSlot from(final LocalTime startAt) {
        validate(startAt);
        return new TimeSlot(startAt);
    }

    private static void validate(final LocalTime startAt) {
        Objects.requireNonNull(startAt, "startAt cannot be null");

        if (startAt.getSecond() != 0 || startAt.getNano() != 0) {
            throw new IllegalArgumentException("timeslot seconds and nanoseconds must be 0 : " + startAt);
        }

        final long seconds = startAt.toSecondOfDay();
        if (seconds % UNIT.getSeconds() != 0) {
            throw new IllegalArgumentException(
                    String.format("timeSlot must be an interval of %d minutes: %s", UNIT.toMinutes(), startAt));
        }
    }

    @Override
    public int compareTo(final TimeSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
