package com.estime.benchmark;

import com.estime.room.participant.vote.Vote;
import com.estime.room.participant.vote.Votes;
import com.estime.room.slot.DateTimeSlot;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Vote 성능 벤치마크
 * <p>
 * 측정 항목: - 객체 생성 속도 - 컬렉션 연산 속도 (정렬) - 통계 계산 속도 (Map 그룹핑)
 */
@Disabled
@DisplayName("Vote 성능 벤치마크")
class VotePerformanceTest {

    private static final boolean PRINT_ENABLED = true;

    private static final int WARMUP_ITERATIONS = 5000;
    private static final int BENCHMARK_ITERATIONS = 10_000;
    private static final int MEASUREMENT_ROUNDS = 5;

    // 테스트 데이터: 일주일(7일) × 24시간(48 슬롯) = 336 슬롯
    private static final LocalDate START_DATE = LocalDate.of(2026, 1, 1);
    private static final int DAYS = 7;
    private static final int SLOTS_PER_DAY = 48;
    private static final int TOTAL_SLOTS = DAYS * SLOTS_PER_DAY;

    // 테스트 데이터: 10명 참여자, 각 200개 슬롯 투표 = 2,000개 투표
    private static final int PARTICIPANT_COUNT = 10;
    private static final int VOTES_PER_PARTICIPANT = 200;
    private static final int TOTAL_VOTES = PARTICIPANT_COUNT * VOTES_PER_PARTICIPANT;

    // 미리 계산된 슬롯 인덱스 (참여자별 200개)
    private List<List<Integer>> participantSlotIndices;

    @BeforeEach
    void setUp() {
        // 각 참여자별로 336개 슬롯 중 200개를 미리 선택
        final Random random = new Random(42);
        participantSlotIndices = new ArrayList<>();

        for (int p = 0; p < PARTICIPANT_COUNT; p++) {
            final List<Integer> allSlots = new ArrayList<>();
            for (int i = 0; i < TOTAL_SLOTS; i++) {
                allSlots.add(i);
            }
            Collections.shuffle(allSlots, random);
            participantSlotIndices.add(allSlots.subList(0, VOTES_PER_PARTICIPANT));
        }
    }

    @Test
    @DisplayName("객체 생성 속도")
    void measureObjectCreationSpeed() {
        printSectionHeader("객체 생성 속도", TOTAL_VOTES, BENCHMARK_ITERATIONS);

        // Warmup
        Object blackhole = null;
        for (int i = 0; i < WARMUP_ITERATIONS; i++) {
            blackhole = createAllVotes();
        }

        final BenchmarkResult result = measurePerformance(() -> {
            Object r = null;
            for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
                r = createAllVotes();
            }
            if (r == null) {
                throw new AssertionError();
            }
        });

        if (blackhole == null) {
            throw new AssertionError();
        }

        printResult(result.getMedianNanos());
    }

    @Test
    @DisplayName("컬렉션 연산 속도 (정렬)")
    void measureCollectionOperations() {
        printSectionHeader("컬렉션 연산 속도 (정렬)", TOTAL_VOTES, BENCHMARK_ITERATIONS);

        final List<Vote> voteList = createAllVotes();

        // Warmup
        Object blackhole = null;
        for (int i = 0; i < WARMUP_ITERATIONS; i++) {
            blackhole = Votes.from(voteList).getSortedVotes();
        }

        final BenchmarkResult result = measurePerformance(() -> {
            Object r = null;
            for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
                r = Votes.from(voteList).getSortedVotes();
            }
            if (r == null) {
                throw new AssertionError();
            }
        });

        if (blackhole == null) {
            throw new AssertionError();
        }

        printResult(result.getMedianNanos());
    }

    @Test
    @DisplayName("통계 계산 속도 (Map 그룹핑)")
    void measureStatisticsCalculation() {
        printSectionHeader("통계 계산 속도 (Map 그룹핑)", TOTAL_VOTES, BENCHMARK_ITERATIONS);

        final List<Vote> voteList = createAllVotes();

        // Warmup
        Object blackhole = null;
        for (int i = 0; i < WARMUP_ITERATIONS; i++) {
            blackhole = Votes.from(voteList).calculateStatistic();
        }

        final BenchmarkResult result = measurePerformance(() -> {
            Object r = null;
            for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
                r = Votes.from(voteList).calculateStatistic();
            }
            if (r == null) {
                throw new AssertionError();
            }
        });

        if (blackhole == null) {
            throw new AssertionError();
        }

        printResult(result.getMedianNanos());
    }

    // ========================================
    // Helper Methods
    // ========================================

    private List<Vote> createAllVotes() {
        final List<Vote> votes = new ArrayList<>(TOTAL_VOTES);
        for (int participantIndex = 0; participantIndex < PARTICIPANT_COUNT; participantIndex++) {
            final long participantId = participantIndex + 1;
            for (final int slotIndex : participantSlotIndices.get(participantIndex)) {
                final LocalDateTime dateTime = slotIndexToDateTime(slotIndex);
                votes.add(Vote.of(participantId,
                        DateTimeSlot.from(dateTime.atZone(ZoneId.of("Asia/Seoul")).toInstant())));
            }
        }
        return votes;
    }

    private LocalDateTime slotIndexToDateTime(final int slotIndex) {
        final int day = slotIndex / SLOTS_PER_DAY;
        final int slotOfDay = slotIndex % SLOTS_PER_DAY;
        final LocalDate date = START_DATE.plusDays(day);
        final LocalTime time = LocalTime.of(slotOfDay / 2, (slotOfDay % 2) * 30);
        return LocalDateTime.of(date, time);
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

    private void printSectionHeader(final String title, final int dataCount, final int iterations) {
        if (!PRINT_ENABLED) {
            return;
        }

        System.out.println("\n========================================");
        System.out.println(title);
        System.out.printf("기준: %,d건, %,d회 반복%n", dataCount, iterations);
        System.out.println("========================================");
    }

    private void printResult(final long nanos) {
        if (!PRINT_ENABLED) {
            return;
        }

        final double millis = nanos / 1_000_000.0;
        System.out.printf("Vote: %.2f ms%n", millis);
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
