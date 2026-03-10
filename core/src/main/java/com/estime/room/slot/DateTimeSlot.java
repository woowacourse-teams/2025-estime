package com.estime.room.slot;

import com.estime.room.slot.exception.DateTimeSlotOutOfRangeException;
import com.estime.room.slot.exception.InvalidTimeDetailException;
import com.estime.room.slot.exception.SlotNotDivideException;
import com.estime.shared.DomainTerm;
import com.estime.shared.Validator;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * 압축된 날짜/시간 슬롯 (24비트)
 *
 * <p>포맷: {@code (flag << 20) | (dayOffset << 8) | timeSlotIndex}
 * <ul>
 *   <li>확장 부분 (4비트) 미사용 </li>
 *   <li>날짜 부분 (12비트): EPOCH로부터 경과한 일수 (0~4095일, 약 11.2년)</li>
 *   <li>시간 부분 (8비트): 30분 단위 슬롯 인덱스 (0~47, 00:00~23:30)</li>
 * </ul>
 *
 * <p>예시:
 * <ul>
 *   <li>2025-10-24 14:00 KST → 28</li>
 *   <li>2025-11-07 09:30 KST → 3603</li>
 *   <li>2026-02-01 23:30 KST → 25647</li>
 * </ul>
 */
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode
public class DateTimeSlot implements Comparable<DateTimeSlot> {

    public static final Duration UNIT = Duration.ofMinutes(30);
    private static final Instant EPOCH =
            LocalDateTime.of(2025, 10, 24, 0, 0)
                    .atZone(ZoneId.of("Asia/Seoul")).toInstant();
    private static final int MINUTES_PER_DAY = 24 * 60;
    private static final int MAX_ENCODED = 0xFFFFFF;
    private static final int DEFAULT_MAX_TIME_SLOT_INDEX = (MINUTES_PER_DAY / (int) UNIT.toMinutes()) - 1;

    private final int encoded;

    public static DateTimeSlot from(final int encoded) {
        if (encoded < 0 || encoded > MAX_ENCODED) {
            throw new DateTimeSlotOutOfRangeException(DomainTerm.DATE_TIME_SLOT, encoded);
        }
        final int timeSlotIndex = encoded & 0xFF;
        if (timeSlotIndex > DEFAULT_MAX_TIME_SLOT_INDEX) {
            throw new DateTimeSlotOutOfRangeException(DomainTerm.TIME_SLOT, encoded);
        }
        return new DateTimeSlot(encoded);
    }

    public static DateTimeSlot from(
            final Instant startAt
            // final Flag.. flag..
    ) {
        Validator.builder()
                .add("startAt", startAt)
                .validateNull();

        if (startAt.isBefore(EPOCH)) {
            throw new DateTimeSlotOutOfRangeException(DomainTerm.DATE_TIME_SLOT, startAt);
        }

        final Duration duration = Duration.between(EPOCH, startAt);
        final long totalSeconds = duration.getSeconds();
        final int nanos = duration.getNano();

        if (nanos != 0 || totalSeconds % 60 != 0) {
            throw new InvalidTimeDetailException(DomainTerm.TIME_SLOT, startAt);
        }

        final long totalMinutes = totalSeconds / 60;
        final int minuteOfDay = (int) (totalMinutes % MINUTES_PER_DAY);

        if (minuteOfDay % UNIT.toMinutes() != 0) {
            throw new SlotNotDivideException(DomainTerm.TIME_SLOT, startAt);
        }

        // final int flag = 0;
        final int dayOffset = (int) (totalMinutes / MINUTES_PER_DAY);
        final int timeSlotIndex = minuteOfDay / (int) UNIT.toMinutes();
        return new DateTimeSlot(/* (flag << 20) | */ (dayOffset << 8) | timeSlotIndex);
    }

    public Instant getStartAt() {
        final int dayOffset = (encoded >> 8) & 0xFFF;
        final int timeSlotIndex = encoded & 0xFF;
        final long totalMinutes = (long) dayOffset * MINUTES_PER_DAY
                + (long) timeSlotIndex * UNIT.toMinutes();
        return EPOCH.plus(Duration.ofMinutes(totalMinutes));
    }

    public Instant getEndAt() {
        return getStartAt().plus(UNIT);
    }

    @Override
    public int compareTo(final DateTimeSlot other) {
        return Integer.compare(this.encoded, other.encoded);
    }

    @Override
    public String toString() {
        return String.format("%s ~ %s (%d)", getStartAt(), getEndAt(), encoded);
    }
}
