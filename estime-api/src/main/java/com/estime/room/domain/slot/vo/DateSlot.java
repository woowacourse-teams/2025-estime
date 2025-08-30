package com.estime.room.domain.slot.vo;

import com.estime.common.util.Validator;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
@EqualsAndHashCode
@FieldNameConstants
public class DateSlot implements Comparable<DateSlot> {

    private final LocalDate startAt;

    public static DateSlot from(final LocalDate startAt) {
        validateNull(startAt);
        return new DateSlot(startAt);
    }

    private static void validateNull(final LocalDate startAt) {
        Validator.builder()
                .add(Fields.startAt, startAt)
                .validateNull();
    }

    @Override
    public int compareTo(final DateSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
