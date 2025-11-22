package com.estime.benchmark;

import com.estime.room.participant.vote.Vote;
import com.estime.room.participant.vote.Votes;
import com.estime.room.participant.vote.compact.CompactVote;
import com.estime.room.participant.vote.compact.CompactVotes;
import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.room.slot.DateTimeSlot;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * CompactVote 성능 벤치마크
 * <p>
 * 기존 Vote와 CompactVote의 성능을 비교 측정합니다.
 * <p>
 * 측정 항목:
 * - 객체 생성 속도
 * - 메모리 사용량 (객체 크기)
 * - 컬렉션 연산 속도 (정렬)
 * - 통계 계산 속도 (Map 그룹핑)
 */
@Disabled
@DisplayName("CompactVote 성능 벤치마크")
class CompactVotePerformanceTest {

    private static final boolean PRINT_ENABLED = true;

    private static final int WARMUP_ITERATIONS = 5000;
    private static final int BENCHMARK_ITERATIONS = 10_000;
    private static final int MEASUREMENT_ROUNDS = 5;

    // 테스트 데이터: 일주일(7일) × 24시간(48 슬롯) = 336 슬롯
    private static final LocalDate START_DATE = LocalDate.of(2026, 1, 1);
    private static final int DAYS = 7;
    private static final int SLOTS_PER_DAY = 48;
    private static final int TOTAL_SLOTS = DAYS * SLOTS_PER_DAY;

    @Test
    @DisplayName("객체 생성 속도 비교")
    void compareObjectCreationSpeed() {
        printSectionHeader("객체 생성 속도 비교");

        // Warmup
        Object blackhole = null;
        for (int i = 0; i < WARMUP_ITERATIONS; i++) {
            blackhole = createVotes(1);
            blackhole = createCompactVotes(1);
        }

        // Vote: LocalDateTime 기반
        final BenchmarkResult voteResult = measurePerformance(() -> {
            Object result = null;
            for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
                result = createVotes(TOTAL_SLOTS);
            }
            // 결과 소비 (최적화 방지)
            if (result == null) {
                throw new AssertionError();
            }
        });

        // CompactVote: 압축 슬롯 기반
        final BenchmarkResult compactResult = measurePerformance(() -> {
            Object result = null;
            for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
                result = createCompactVotes(TOTAL_SLOTS);
            }
            // 결과 소비 (최적화 방지)
            if (result == null) {
                throw new AssertionError();
            }
        });

        // blackhole 사용 (최적화 방지)
        if (blackhole == null) {
            throw new AssertionError();
        }

        printResult(voteResult.getMedianNanos(), compactResult.getMedianNanos());
    }

    @Test
    @DisplayName("메모리 사용량 비교 (객체 크기)")
    void compareMemoryUsage() {
        printSectionHeader("메모리 사용량 비교 (객체 크기)");

        // Vote (참가자 ID + LocalDateTime)
        final long voteSize = estimateObjectSize(
                8L,  // participant_id (Long)
                createDateTimeSlot(START_DATE, LocalTime.of(9, 0))  // DateTimeSlot
        );

        // CompactVote (참가자 ID + int)
        final long compactVoteSize = estimateObjectSize(
                8L,  // participant_id (Long)
                CompactDateTimeSlot.from(LocalDateTime.of(START_DATE, LocalTime.of(9, 0))  // CompactDateTimeSlot
                ));

        if (PRINT_ENABLED) {
            System.out.printf("Vote 객체 크기:        ~%d bytes%n", voteSize);
            System.out.printf("CompactVote 객체 크기: ~%d bytes%n", compactVoteSize);
            System.out.printf("절감:                  %d bytes (%.1f%%)%n",
                    voteSize - compactVoteSize,
                    (1 - (double) compactVoteSize / voteSize) * 100);
            System.out.println();
            System.out.printf("336 슬롯 × 10명 기준:%n");
            System.out.printf("Vote 총 메모리:        ~%,d bytes (%.2f KB)%n", voteSize * TOTAL_SLOTS * 10,
                    voteSize * TOTAL_SLOTS * 10 / 1024.0);
            System.out.printf("CompactVote 총 메모리: ~%,d bytes (%.2f KB)%n", compactVoteSize * TOTAL_SLOTS * 10,
                    compactVoteSize * TOTAL_SLOTS * 10 / 1024.0);
            System.out.println("========================================");
        }
    }

    @Test
    @DisplayName("컬렉션 연산 속도 비교 (정렬)")
    void compareCollectionOperations() {
        printSectionHeader("컬렉션 연산 속도 비교 (정렬)");

        final List<Vote> voteList = createVotes(TOTAL_SLOTS);
        final List<CompactVote> compactVoteList = createCompactVotes(TOTAL_SLOTS);

        // Warmup
        Object blackhole = null;
        for (int i = 0; i < WARMUP_ITERATIONS / 10; i++) {
            blackhole = Votes.from(voteList).getSortedVotes();
            blackhole = CompactVotes.from(compactVoteList).getSortedVotes();
        }

        // Vote: LocalDateTime 비교
        final BenchmarkResult voteResult = measurePerformance(() -> {
            Object result = null;
            for (int i = 0; i < BENCHMARK_ITERATIONS / 10; i++) {
                result = Votes.from(voteList).getSortedVotes();
            }
            if (result == null) {
                throw new AssertionError();
            }
        });

        // CompactVote: int 비교
        final BenchmarkResult compactResult = measurePerformance(() -> {
            Object result = null;
            for (int i = 0; i < BENCHMARK_ITERATIONS / 10; i++) {
                result = CompactVotes.from(compactVoteList).getSortedVotes();
            }
            if (result == null) {
                throw new AssertionError();
            }
        });

        if (blackhole == null) {
            throw new AssertionError();
        }

        printResult(voteResult.getMedianNanos(), compactResult.getMedianNanos());
    }

    @Test
    @DisplayName("통계 계산 속도 비교 (Map 그룹핑)")
    void compareStatisticsCalculation() {
        printSectionHeader("통계 계산 속도 비교 (Map 그룹핑)");

        // 10명의 참가자가 336개 슬롯에 투표
        final List<Vote> voteList = new ArrayList<>();
        final List<CompactVote> compactVoteList = new ArrayList<>();

        for (long participantId = 1; participantId <= 10; participantId++) {
            for (int day = 0; day < DAYS; day++) {
                for (int slotIndex = 0; slotIndex < SLOTS_PER_DAY; slotIndex++) {
                    final LocalDate date = START_DATE.plusDays(day);
                    final LocalTime time = LocalTime.of(slotIndex / 2, (slotIndex % 2) * 30);

                    voteList.add(Vote.of(participantId, createDateTimeSlot(date, time)));
                    compactVoteList.add(CompactVote.of(participantId, CompactDateTimeSlot.from(LocalDateTime.of(date, time))));
                }
            }
        }

        if (PRINT_ENABLED) {
            System.out.printf("테스트 데이터: 참가자 10명 × 슬롯 %d개 = 총 %,d개 투표%n", TOTAL_SLOTS, voteList.size());
            System.out.println();
        }

        // Warmup
        Object blackhole = null;
        for (int i = 0; i < 100; i++) {
            blackhole = Votes.from(voteList).calculateStatistic();
            blackhole = CompactVotes.from(compactVoteList).calculateStatistic();
        }

        // Vote: LocalDateTime 키로 그룹핑
        final BenchmarkResult voteResult = measurePerformance(() -> {
            Object result = null;
            for (int i = 0; i < 1000; i++) {
                result = Votes.from(voteList).calculateStatistic();
            }
            if (result == null) {
                throw new AssertionError();
            }
        });

        // CompactVote: int 키로 그룹핑
        final BenchmarkResult compactResult = measurePerformance(() -> {
            Object result = null;
            for (int i = 0; i < 1000; i++) {
                result = CompactVotes.from(compactVoteList).calculateStatistic();
            }
            if (result == null) {
                throw new AssertionError();
            }
        });

        if (blackhole == null) {
            throw new AssertionError();
        }

        printResult(voteResult.getMedianNanos(), compactResult.getMedianNanos());
    }

    // ========================================
    // Helper Methods
    // ========================================

    private List<Vote> createVotes(final int count) {
        final List<Vote> votes = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            final int day = i / SLOTS_PER_DAY;
            final int slotIndex = i % SLOTS_PER_DAY;
            final LocalDate date = START_DATE.plusDays(day);
            final LocalTime time = LocalTime.of(slotIndex / 2, (slotIndex % 2) * 30);
            votes.add(Vote.of(1L, createDateTimeSlot(date, time)));
        }
        return votes;
    }

    private List<CompactVote> createCompactVotes(final int count) {
        final List<CompactVote> votes = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            final int day = i / SLOTS_PER_DAY;
            final int slotIndex = i % SLOTS_PER_DAY;
            final LocalDate date = START_DATE.plusDays(day);
            final LocalTime time = LocalTime.of(slotIndex / 2, (slotIndex % 2) * 30);
            votes.add(CompactVote.of(1L, CompactDateTimeSlot.from(LocalDateTime.of(date, time))));
        }
        return votes;
    }

    private DateTimeSlot createDateTimeSlot(final LocalDate date, final LocalTime time) {
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

    private BenchmarkResult measurePerformance(final Runnable benchmark) {
        final long[] measurements = new long[MEASUREMENT_ROUNDS];

        for (int round = 0; round < MEASUREMENT_ROUNDS; round++) {
            System.gc();
            try {
                Thread.sleep(100);
            } catch (final InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            final long start = System.nanoTime();
            benchmark.run();
            measurements[round] = System.nanoTime() - start;
        }

        return new BenchmarkResult(measurements);
    }

    private void printSectionHeader(final String title) {
        if (!PRINT_ENABLED) {
            return;
        }

        System.out.println("\n========================================");
        System.out.println(title);
        System.out.println("========================================");
    }

    private void printResult(final long voteNanos, final long compactVoteNanos) {
        if (!PRINT_ENABLED) {
            return;
        }

        final double voteMillis = voteNanos / 1_000_000.0;
        final double compactVoteMillis = compactVoteNanos / 1_000_000.0;
        final double speedup = (double) voteNanos / compactVoteNanos;

        System.out.printf("Vote:        %.2f ms%n", voteMillis);
        System.out.printf("CompactVote: %.2f ms%n", compactVoteMillis);
        System.out.printf("성능 개선:    %.2fx%n", Math.abs(speedup));
        System.out.println("========================================");
    }

    private static class BenchmarkResult {
        private final long medianNanos;

        BenchmarkResult(final long[] measurements) {
            Arrays.sort(measurements);
            this.medianNanos = measurements[measurements.length / 2];
        }

        long getMedianNanos() {
            return medianNanos;
        }
    }
}
