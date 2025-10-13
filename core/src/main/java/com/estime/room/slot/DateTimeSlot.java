package com.estime.room.slot;

import com.estime.room.slot.exception.SlotNotDivideException;
import com.estime.shared.DomainTerm;
import com.estime.shared.Validator;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
        validateNull(startAt);
        validateStartAt(startAt);
        return new DateTimeSlot(startAt);
    }

    private static void validateNull(final LocalDateTime startAt) {
        Validator.builder()
                .add("startAt", startAt)
                .validateNull();
    }

    private static void validateStartAt(final LocalDateTime startAt) {
        if (startAt.getMinute() != 0 && startAt.getMinute() != UNIT.toMinutes()) {
            throw new SlotNotDivideException(DomainTerm.DATE_TIME_SLOT, startAt);
        }
    }

    public LocalDate getDate() {
        return startAt.toLocalDate();
    }

    public LocalTime getTime() {
        return startAt.toLocalTime();
    }

    public boolean isBefore(final LocalDateTime other) {
        return startAt.isBefore(other);
    }

    @Override
    public int compareTo(final DateTimeSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
