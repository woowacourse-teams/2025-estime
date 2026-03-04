package com.estime.room;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.participant.vote.Vote;
import com.estime.room.participant.vote.VoteJpaRepository;
import com.estime.room.slot.DateTimeSlot;
import com.estime.support.IntegrationTest;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.mysql.MySQLContainer;

/**
 * 저장 시 Batch INSERT 동작 및 N+1 문제 여부를 확인하는 통합 테스트.
 * <p>
 * 주요 검증 항목:
 * <p>
 * 1. Room 저장 시 RoomAvailableSlot Batch INSERT 동작
 * <p>
 * 2. Vote 저장 시 불필요한 SELECT(N+1) 발생 여부 및 Batch INSERT 동작
 */
@Disabled("문서화 목적의 테스트. 실제 실행 시 데이터가 커밋됨.")
@Transactional
@Rollback(false)
class SqlCountTest extends IntegrationTest {

    private static final String GENERAL_LOG_PATH = "/var/log/mysql/general.log";

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private VoteJpaRepository voteJpaRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private MySQLContainer mysqlContainer;

    @Test
    @DisplayName("Room 저장 시 AvailableSlots가 Batch INSERT로 동작하는지 확인한다")
    void verifyRoomBatchInsert() throws Exception {
        // given
        final var logLineCountBefore = getGeneralLogLineCount();

        final var date = NOW_LOCAL_DATE.plusDays(1);
        final Room room = Room.withoutId(
                "batchTest",
                RoomSession.from("batchTestSession"),
                LocalDateTime.of(NOW_LOCAL_DATE.plusDays(3), LocalTime.of(10, 0)),
                List.of(
                        DateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(10, 0))),
                        DateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(10, 30))),
                        DateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(11, 0))),
                        DateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(11, 30)))
                )
        );

        // when
        roomRepository.save(room);
        entityManager.flush();
        Thread.sleep(300);

        // then
        final var queries = readNewQueriesFromGeneralLog(logLineCountBefore, "room", "room_available_slot");

        printQueries(queries);

        final var slotInsertQueries = queries.stream()
                .filter(q -> q.toLowerCase().contains("insert") && q.contains("room_available_slot"))
                .toList();

        System.out.println(">>> room_available_slot INSERT 쿼리 수: " + slotInsertQueries.size());

        // batch_size=50 기준. batch_size 변경 시 예상 개수 조정 필요
        assertThat(slotInsertQueries)
                .as("Batch INSERT 동작 확인: 개별 INSERT(4개)가 아닌 multi-value INSERT로 실행되어야 함")
                .hasSizeLessThan(4);
    }

    @Test
    @DisplayName("Vote 저장 시 N+1 문제 없이 Batch INSERT로 동작하는지 확인한다")
    void verifyVoteBatchInsert() throws Exception {
        // given
        final var logLineCountBefore = getGeneralLogLineCount();

        final long participantId = 1L;
        final List<Vote> votes = new ArrayList<>();
        final LocalDateTime baseTime = LocalDateTime.of(2026, 1, 1, 10, 0);

        // 10개의 Vote 생성
        for (int i = 0; i < 10; i++) {
            votes.add(Vote.of(participantId, DateTimeSlot.from(baseTime.plusMinutes(30L * i))));
        }

        // when
        voteJpaRepository.saveAll(votes);
        entityManager.flush();

        // then
        final var queries = readNewQueriesFromGeneralLog(logLineCountBefore, "vote");

        printQueries(queries);

        final var selectQueries = queries.stream()
                .filter(q -> q.toLowerCase().contains("select") && q.contains("vote"))
                .toList();

        final var insertQueries = queries.stream()
                .filter(q -> q.toLowerCase().contains("insert") && q.contains("vote"))
                .toList();

        System.out.println(">>> Vote SELECT 쿼리 수: " + selectQueries.size());
        System.out.println(">>> Vote INSERT 쿼리 수: " + insertQueries.size());

        assertSoftly(softly -> {
            softly.assertThat(selectQueries)
                    .as("Vote 저장 시 불필요한 SELECT 쿼리가 발생하지 않아야 한다 (Persistable 구현)")
                    .isEmpty();

            softly.assertThat(insertQueries)
                    .as("Batch INSERT(rewriteBatchedStatements)가 적용되어 1개의 INSERT 쿼리만 실행되어야 한다")
                    .hasSize(1);
        });
    }

    private long getGeneralLogLineCount() throws Exception {
        final var result = mysqlContainer.execInContainer("wc", "-l", GENERAL_LOG_PATH);
        return Long.parseLong(result.getStdout().trim().split("\\s+")[0]);
    }

    private List<String> readNewQueriesFromGeneralLog(final long skipLines, final String... keywords) throws Exception {
        final var result = mysqlContainer.execInContainer("cat", GENERAL_LOG_PATH);
        return result.getStdout().lines()
                .skip(skipLines)
                .filter(line -> line.contains("Query"))
                .filter(line -> {
                    if (line.contains("autocommit")) {
                        return true;
                    }
                    for (final String keyword : keywords) {
                        if (line.contains(keyword)) {
                            return true;
                        }
                    }
                    return false;
                })
                .toList();
    }

    private void printQueries(final List<String> queries) {
        System.out.println("\n========== MySQL General Query Log ==========");
        queries.forEach(System.out::println);
        System.out.println("==============================================\n");
    }
}
