package com.estime.room.slot;

import com.estime.room.slot.exception.InvalidTimeDetailException;
import com.estime.room.slot.exception.SlotNotDivideException;
import com.estime.shared.DomainTerm;
import java.time.LocalDate;
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
        return new CompactDateTimeSlot(encoded);
    }

    public static CompactDateTimeSlot from(final LocalDate date, final LocalTime time) {
        // TODO VO를 입력받으면 좋을 것 같다
        if (time.getMinute() != 0 && time.getMinute() != 30) {
            throw new SlotNotDivideException(DomainTerm.TIME_SLOT, time);
        }

        if (time.getSecond() != 0 || time.getNano() != 0) {
            throw new InvalidTimeDetailException(DomainTerm.TIME_SLOT, time);
        }

        final long dayOffset = ChronoUnit.DAYS.between(EPOCH, date);
        final int timeSlotIndex = (time.getHour() * 60 + time.getMinute()) / (int) DateTimeSlot.UNIT.toMinutes();
        return new CompactDateTimeSlot((int) ((dayOffset << 8) | timeSlotIndex));
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
