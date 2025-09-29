package com.estime.room.timeslot;

import com.estime.common.DomainTerm;
import com.estime.common.exception.InvalidTimeDetailException;
import com.estime.common.exception.SlotNotDivideException;
import com.estime.common.util.Validator;
import java.time.Duration;
import java.time.LocalTime;
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
        validateNull(startAt);
        validateStartAt(startAt);
        return new TimeSlot(startAt);
    }

    private static void validateNull(final LocalTime startAt) {
        Validator.builder()
                .add("startAt", startAt)
                .validateNull();
    }

    private static void validateStartAt(final LocalTime startAt) {
        if (startAt.getSecond() != 0 || startAt.getNano() != 0) {
            throw new InvalidTimeDetailException(DomainTerm.TIME_SLOT, startAt);
        }

        final long seconds = startAt.toSecondOfDay();
        if (seconds % UNIT.getSeconds() != 0) {
            throw new SlotNotDivideException(DomainTerm.TIME_SLOT, UNIT.toMinutes());
        }
    }

    @Override
    public int compareTo(final TimeSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
