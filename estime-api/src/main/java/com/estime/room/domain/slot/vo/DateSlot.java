package com.estime.room.domain.slot.vo;

import com.estime.common.DomainTerm;
import com.estime.common.exception.domain.PastNotAllowedException;
import com.estime.common.exception.util.Validator;
import java.time.Duration;
import java.time.LocalDate;
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
        validateNull(startAt);
        validateStartAt(startAt);
        return new DateSlot(startAt);
    }

    private static void validateNull(final LocalDate startAt) {
        Validator.builder()
                .add("startAt", startAt)
                .validateNull();
    }

    private static void validateStartAt(final LocalDate startAt) {
        if (startAt.isBefore(LocalDate.now())) {
            throw new PastNotAllowedException(DomainTerm.DATE_SLOT, startAt);
        }
    }

    @Override
    public int compareTo(final DateSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
