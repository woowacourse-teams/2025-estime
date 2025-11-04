package com.estime.room.slot;

import com.estime.room.slot.exception.CompactDateTimeSlotOutOfRangeException;
import com.estime.room.slot.exception.InvalidTimeDetailException;
import com.estime.room.slot.exception.SlotNotDivideException;
import com.estime.shared.DomainTerm;
import com.estime.shared.Validator;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * 압축된 날짜/시간 슬롯 (20비트)
 *
 * <p>포맷: {@code (dayOffset << 8) | timeSlotIndex}
 * <ul>
 *   <li>날짜 부분 (12비트): EPOCH(2025-10-24)로부터 경과한 일수 (0~4095일, 약 11.2년)</li>
 *   <li>시간 부분 (8비트): 30분 단위 슬롯 인덱스 (0~47, 00:00~23:30)</li>
 * </ul>
 *
 * <p>예시:
 * <ul>
 *   <li>2025-10-24 14:00 → 28</li>
 *   <li>2025-11-07 09:30 → 3603</li>
 *   <li>2026-02-01 23:30 → 25647</li>
 * </ul>
 */
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode
public class CompactDateTimeSlot implements Comparable<CompactDateTimeSlot> {

    private static final LocalDate EPOCH = LocalDate.of(2025, 10, 24);

    private final int encoded;

    public static CompactDateTimeSlot from(final int encoded) {
        if (encoded < 0 || encoded > 0xFFFFF) {
            throw new CompactDateTimeSlotOutOfRangeException(DomainTerm.DATE_TIME_SLOT, encoded);
        }
        return new CompactDateTimeSlot(encoded);
    }

    public static CompactDateTimeSlot from(final LocalDateTime startAt) {
        validateNull(startAt);
        validateStartAt(startAt);

        final long dayOffset = ChronoUnit.DAYS.between(EPOCH, startAt);
        final int timeSlotIndex = (startAt.getHour() * 60 + startAt.getMinute()) / (int) DateTimeSlot.UNIT.toMinutes();
        return new CompactDateTimeSlot((int) ((dayOffset << 8) | timeSlotIndex));
    }

    private static void validateStartAt(final LocalDateTime startAt) {
        if (startAt.getMinute() != 0 && startAt.getMinute() != AvailableTimeSlot.UNIT.toMinutes()) {
            throw new SlotNotDivideException(DomainTerm.TIME_SLOT, startAt);
        }

        if (startAt.getSecond() != 0 || startAt.getNano() != 0) {
            throw new InvalidTimeDetailException(DomainTerm.TIME_SLOT, startAt);
        }
    }

    private static void validateNull(final LocalDateTime startAt) {
        Validator.builder()
                .add("startAt", startAt)
                .validateNull();
    }

    public LocalDate getStartAtLocalDate() {
        final int dayOffset = (encoded >> 8) & 0xFFF;
        return EPOCH.plusDays(dayOffset);
    }

    public LocalTime getStartAtLocalTime() {
        final int timeSlotIndex = encoded & 0xFF;
        final int totalMinutes = timeSlotIndex * (int) DateTimeSlot.UNIT.toMinutes();
        return LocalTime.of(totalMinutes / 60, totalMinutes % 60);
    }

    @Override
    public int compareTo(final CompactDateTimeSlot other) {
        return Integer.compare(this.encoded, other.encoded);
    }

    @Override
    public String toString() {
        final LocalDate date = getStartAtLocalDate();
        final LocalTime time = getStartAtLocalTime();
        return String.format("%s %s (%d)", date, time, encoded);
    }
}
