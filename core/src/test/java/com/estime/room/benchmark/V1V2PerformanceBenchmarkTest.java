package com.estime.room.benchmark;

import com.estime.room.participant.vote.Vote;
import com.estime.room.participant.vote.Votes;
import com.estime.room.participant.vote.compact.CompactVote;
import com.estime.room.participant.vote.compact.CompactVotes;
import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.room.slot.DateTimeSlot;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * V1 vs V2 성능 벤치마크
 * <p>
 * 측정 항목:
 * - 객체 생성 속도
 * - 메모리 사용량 (객체 크기)
 * - 직렬화/역직렬화 속도
 * - 컬렉션 연산 속도
 */
@DisplayName("V1 vs V2 성능 벤치마크")
class V1V2PerformanceBenchmarkTest {

    private static final int WARMUP_ITERATIONS = 1000;
    private static final int BENCHMARK_ITERATIONS = 10_000;

    // 테스트 데이터: 일주일(7일) × 24시간(48 슬롯) = 336 슬롯
    private static final LocalDate START_DATE = LocalDate.of(2026, 1, 1);
    private static final int DAYS = 7;
    private static final int SLOTS_PER_DAY = 48;
    private static final int TOTAL_SLOTS = DAYS * SLOTS_PER_DAY;

    @Test
    @DisplayName("객체 생성 속도 비교")
    void compareObjectCreationSpeed() {
        System.out.println("\n========================================");
        System.out.println("1. 객체 생성 속도 비교");
        System.out.println("========================================");

        // Warmup
        for (int i = 0; i < WARMUP_ITERATIONS; i++) {
            createV1Votes(1);
            createV2Votes(1);
        }

        // V1: LocalDateTime 기반
        final long v1Start = System.nanoTime();
        for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
            createV1Votes(TOTAL_SLOTS);
        }
        final long v1Duration = System.nanoTime() - v1Start;

        // V2: 압축 슬롯 기반
        final long v2Start = System.nanoTime();
        for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
            createV2Votes(TOTAL_SLOTS);
        }
        final long v2Duration = System.nanoTime() - v2Start;

        printResult("객체 생성", v1Duration, v2Duration);
    }

    @Test
    @DisplayName("메모리 사용량 비교 (객체 크기)")
    void compareMemoryUsage() {
        System.out.println("\n========================================");
        System.out.println("2. 메모리 사용량 비교");
        System.out.println("========================================");

        // V1: Vote (참가자 ID + LocalDateTime)
        final long v1ObjectSize = estimateObjectSize(
                8L,  // participant_id (Long)
                createV1DateTimeSlot(START_DATE, LocalTime.of(9, 0))  // DateTimeSlot
        );

        // V2: CompactVote (참가자 ID + int)
        final long v2ObjectSize = estimateObjectSize(
                8L,  // participant_id (Long)
                CompactDateTimeSlot.from(START_DATE, LocalTime.of(9, 0))  // CompactDateTimeSlot
        );

        System.out.printf("V1 (Vote) 객체 크기:        ~%d bytes%n", v1ObjectSize);
        System.out.printf("V2 (CompactVote) 객체 크기: ~%d bytes%n", v2ObjectSize);
        System.out.printf("절감:                        %d bytes (%.1f%%)%n",
                v1ObjectSize - v2ObjectSize,
                (1 - (double) v2ObjectSize / v1ObjectSize) * 100);
        System.out.println();
        System.out.printf("336 슬롯 × 10명 기준:%n");
        System.out.printf("V1 총 메모리: ~%,d bytes (%.2f KB)%n", v1ObjectSize * TOTAL_SLOTS * 10, v1ObjectSize * TOTAL_SLOTS * 10 / 1024.0);
        System.out.printf("V2 총 메모리: ~%,d bytes (%.2f KB)%n", v2ObjectSize * TOTAL_SLOTS * 10, v2ObjectSize * TOTAL_SLOTS * 10 / 1024.0);
        System.out.println("========================================");
    }

    @Test
    @DisplayName("toString() 직렬화 속도 비교")
    void compareSerializationSpeed() {
        System.out.println("\n========================================");
        System.out.println("3. toString() 직렬화 속도 비교");
        System.out.println("========================================");

        final DateTimeSlot v1Slot = createV1DateTimeSlot(START_DATE, LocalTime.of(14, 30));
        final CompactDateTimeSlot v2Slot = CompactDateTimeSlot.from(START_DATE, LocalTime.of(14, 30));

        // Warmup
        for (int i = 0; i < WARMUP_ITERATIONS; i++) {
            v1Slot.toString();
            v2Slot.toString();
        }

        // V1: LocalDateTime.toString()
        final long v1Start = System.nanoTime();
        for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
            v1Slot.toString();
        }
        final long v1Duration = System.nanoTime() - v1Start;

        // V2: 디코딩 + 포맷팅
        final long v2Start = System.nanoTime();
        for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
            v2Slot.toString();
        }
        final long v2Duration = System.nanoTime() - v2Start;

        System.out.printf("V1 toString() 결과: %s%n", v1Slot);
        System.out.printf("V2 toString() 결과: %s%n", v2Slot);
        System.out.println();

        printResult("toString() 직렬화", v1Duration, v2Duration);
    }

    @Test
    @DisplayName("컬렉션 연산 속도 비교 (정렬, 필터링)")
    void compareCollectionOperations() {
        System.out.println("\n========================================");
        System.out.println("4. 컬렉션 연산 속도 비교");
        System.out.println("========================================");

        final List<Vote> v1List = createV1Votes(TOTAL_SLOTS);
        final List<CompactVote> v2List = createV2Votes(TOTAL_SLOTS);

        // Warmup
        for (int i = 0; i < WARMUP_ITERATIONS / 10; i++) {
            Votes.from(v1List).getSortedVotes();
            CompactVotes.from(v2List).getSortedVotes();
        }

        // V1: LocalDateTime 비교
        final long v1Start = System.nanoTime();
        for (int i = 0; i < BENCHMARK_ITERATIONS / 10; i++) {
            Votes.from(v1List).getSortedVotes();
        }
        final long v1Duration = System.nanoTime() - v1Start;

        // V2: int 비교
        final long v2Start = System.nanoTime();
        for (int i = 0; i < BENCHMARK_ITERATIONS / 10; i++) {
            CompactVotes.from(v2List).getSortedVotes();
        }
        final long v2Duration = System.nanoTime() - v2Start;

        printResult("정렬 연산", v1Duration, v2Duration);
    }

    @Test
    @DisplayName("통계 계산 속도 비교 (Map 그룹핑)")
    void compareStatisticsCalculation() {
        System.out.println("\n========================================");
        System.out.println("5. 통계 계산 속도 비교");
        System.out.println("========================================");

        // 10명의 참가자가 336개 슬롯에 투표
        final List<Vote> v1List = new ArrayList<>();
        final List<CompactVote> v2List = new ArrayList<>();

        for (long participantId = 1; participantId <= 10; participantId++) {
            for (int day = 0; day < DAYS; day++) {
                for (int slotIndex = 0; slotIndex < SLOTS_PER_DAY; slotIndex++) {
                    final LocalDate date = START_DATE.plusDays(day);
                    final LocalTime time = LocalTime.of(slotIndex / 2, (slotIndex % 2) * 30);

                    v1List.add(Vote.of(participantId, createV1DateTimeSlot(date, time)));
                    v2List.add(CompactVote.of(participantId, CompactDateTimeSlot.from(date, time)));
                }
            }
        }

        System.out.printf("테스트 데이터: 참가자 10명 × 슬롯 %d개 = 총 %,d개 투표%n", TOTAL_SLOTS, v1List.size());
        System.out.println();

        // Warmup
        for (int i = 0; i < 100; i++) {
            Votes.from(v1List).calculateStatistic();
            CompactVotes.from(v2List).calculateStatistic();
        }

        // V1: LocalDateTime 키로 그룹핑
        final long v1Start = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            Votes.from(v1List).calculateStatistic();
        }
        final long v1Duration = System.nanoTime() - v1Start;

        // V2: int 키로 그룹핑
        final long v2Start = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            CompactVotes.from(v2List).calculateStatistic();
        }
        final long v2Duration = System.nanoTime() - v2Start;

        printResult("통계 계산 (Map 그룹핑)", v1Duration, v2Duration);
    }

    // ========================================
    // Helper Methods
    // ========================================

    private List<Vote> createV1Votes(final int count) {
        final List<Vote> votes = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            final int day = i / SLOTS_PER_DAY;
            final int slotIndex = i % SLOTS_PER_DAY;
            final LocalDate date = START_DATE.plusDays(day);
            final LocalTime time = LocalTime.of(slotIndex / 2, (slotIndex % 2) * 30);
            votes.add(Vote.of(1L, createV1DateTimeSlot(date, time)));
        }
        return votes;
    }

    private List<CompactVote> createV2Votes(final int count) {
        final List<CompactVote> votes = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            final int day = i / SLOTS_PER_DAY;
            final int slotIndex = i % SLOTS_PER_DAY;
            final LocalDate date = START_DATE.plusDays(day);
            final LocalTime time = LocalTime.of(slotIndex / 2, (slotIndex % 2) * 30);
            votes.add(CompactVote.of(1L, CompactDateTimeSlot.from(date, time)));
        }
        return votes;
    }

    private DateTimeSlot createV1DateTimeSlot(final LocalDate date, final LocalTime time) {
        return DateTimeSlot.from(LocalDateTime.of(date, time));
    }

    private long estimateObjectSize(final Object... fields) {
        long size = 12; // 객체 헤더 (최소)
        for (final Object field : fields) {
            if (field instanceof Long) {
                size += 8;
            } else if (field instanceof Integer) {
                size += 4;
            } else if (field instanceof DateTimeSlot) {
                size += 8; // LocalDateTime (2개 long)
            } else if (field instanceof CompactDateTimeSlot) {
                size += 4; // int
            } else {
                size += 8; // 레퍼런스
            }
        }
        return size;
    }

    private void printResult(final String operation, final long v1Nanos, final long v2Nanos) {
        final double v1Millis = v1Nanos / 1_000_000.0;
        final double v2Millis = v2Nanos / 1_000_000.0;
        final double speedup = (double) v1Nanos / v2Nanos;

        System.out.printf("V1 (%s): %.2f ms%n", operation, v1Millis);
        System.out.printf("V2 (%s): %.2f ms%n", operation, v2Millis);
        System.out.printf("성능 개선: %.2fx %s%n",
                Math.abs(speedup),
                speedup > 1 ? "빠름 ⚡" : "느림 🐌");
        System.out.println("========================================");
    }
}
