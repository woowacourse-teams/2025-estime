package com.estime.room;

import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.support.IntegrationTest;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.MySQLContainer;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Room 저장 시 Batch INSERT 동작을 확인하는 테스트.
 * <p>
 * RoomAvailableSlot은 @EmbeddedId(복합키)를 사용하므로 IDENTITY 제약 없이 Batch INSERT 가능.
 * <p>
 * rewriteBatchedStatements=true 설정 시 Multi-value INSERT로 변환됨.
 * <p>
 * 기본 batch_size=50 기준 테스트. batch_size 변경 시 assertion 조정 필요.
 */
@Disabled("문서화 목적의 테스트. 실제 실행 시 데이터가 커밋됨.")
@Transactional
@Rollback(false)
class SqlCountTest extends IntegrationTest {

    private static final String GENERAL_LOG_PATH = "/var/log/mysql/general.log";

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private MySQLContainer<?> mysqlContainer;

    @Test
    void verifyBatchInsertWithGeneralLog() throws Exception {
        // given
        final var logLineCountBefore = getGeneralLogLineCount();

        final var date = NOW_LOCAL_DATE.plusDays(1);
        final Room room = Room.withoutId(
                "batchTest",
                RoomSession.from("batchTestSession"),
                LocalDateTime.of(NOW_LOCAL_DATE.plusDays(3), LocalTime.of(10, 0)),
                List.of(
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(10, 0))),
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(10, 30))),
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(11, 0))),
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(11, 30)))
                )
        );

        // when
        roomRepository.save(room);
        entityManager.flush();
        Thread.sleep(300);

        // then
        final var queries = readNewQueriesFromGeneralLog(logLineCountBefore);

        System.out.println("\n========== MySQL General Query Log ==========");
        queries.forEach(System.out::println);
        System.out.println("==============================================\n");

        final var slotInsertQueries = queries.stream()
                .filter(q -> q.toLowerCase().contains("insert") && q.contains("room_available_slot"))
                .toList();

        System.out.println(">>> room_available_slot INSERT 쿼리 수: " + slotInsertQueries.size());
        System.out.println(">>> Batch INSERT 동작 시 multi-value INSERT로 실행됨 (batch_size=50 기준 1개)");

        // batch_size=50 기준. batch_size 변경 시 예상 개수 조정 필요
        // 예: batch_size=2, 슬롯 4개 → 2개의 INSERT
        assertThat(slotInsertQueries)
                .as("Batch INSERT 동작 확인: 개별 INSERT(4개)가 아닌 multi-value INSERT로 실행되어야 함")
                .hasSizeLessThan(4);
    }

    private long getGeneralLogLineCount() throws Exception {
        final var result = mysqlContainer.execInContainer("wc", "-l", GENERAL_LOG_PATH);
        return Long.parseLong(result.getStdout().trim().split("\\s+")[0]);
    }

    private List<String> readNewQueriesFromGeneralLog(final long skipLines) throws Exception {
        final var result = mysqlContainer.execInContainer("cat", GENERAL_LOG_PATH);
        return result.getStdout().lines()
                .skip(skipLines)
                .filter(line -> line.contains("Query"))
                .filter(line -> line.contains("room") || line.contains("autocommit"))
                .toList();
    }
}
