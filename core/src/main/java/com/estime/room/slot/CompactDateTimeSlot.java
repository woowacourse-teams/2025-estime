package com.estime.room.slot;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

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

    @Override
    public int compareTo(final CompactDateTimeSlot other) {
        return Integer.compare(this.encoded, other.encoded);
    }

    @Override
    public String toString() {
        final int dayOffset = (encoded >> 8) & 0xFFF;
        final int timeSlotIndex = encoded & 0xFF;

        final LocalDate date = EPOCH.plusDays(dayOffset);
        final int totalMinutes = timeSlotIndex * 30;
        final LocalTime time = LocalTime.of(totalMinutes / 60, totalMinutes % 60);

        return String.format("%s %s (%d)", date, time, encoded);
    }
}
