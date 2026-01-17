package com.estime.room;

import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.support.IntegrationTest;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

/**
 * Room 저장 시 INSERT 쿼리 횟수를 확인하는 테스트.
 * <p>
 * 결론: Room이 IDENTITY 전략을 사용하기 때문에 batch insert가 적용되지 않음. - Room INSERT 시 즉시 실행되어 ID를 획득해야 함
 * <p>
 * 이로 인해 cascade로 저장되는 RoomAvailableSlot도 batch로 묶이지 않음 - 결과적으로 Room 1회 + RoomAvailableSlot N회 = 총 N+1회 INSERT 발생
 * <p>
 * batch insert를 활용하려면 Room의 ID 전략 변경 혹은 save room 이후 slot batch insert 필요.
 */
@Disabled("문서화 목적의 테스트. 실제 실행 시 데이터가 커밋됨.")
@Transactional
@Rollback(false)
class SqlCountTest extends IntegrationTest {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void countInsertQueriesForRoomSave() {
        // given
        final var date = NOW_LOCAL_DATE.plusDays(1);
        final Room room = Room.withoutId(
                "test",
                RoomSession.from("sqlCountTestSession"),
                LocalDateTime.of(NOW_LOCAL_DATE.plusDays(3), LocalTime.of(10, 0)),
                List.of(
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(10, 0))),
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(10, 30))),
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(11, 0))),
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(11, 30)))
                )
        );

        // Enable statistics
        final Session session = entityManager.unwrap(Session.class);
        final Statistics statistics = session.getSessionFactory().getStatistics();
        statistics.setStatisticsEnabled(true);
        statistics.clear();

        System.out.println("========== START: Room Save ==========");
        System.out.println("Available slots count: " + room.getRoomAvailableSlots().size());

        // when
        roomRepository.save(room);
        entityManager.flush();

        System.out.println("========== END: Room Save ==========");
        System.out.println("Entity Insert Count: " + statistics.getEntityInsertCount());
        System.out.println("Prepared Statement Count: " + statistics.getPrepareStatementCount());
        System.out.println("Statements Executed to DB: " + statistics.getQueryExecutionCount());
        System.out.println("Flush Count: " + statistics.getFlushCount());

        // batch 설정 확인
        final var sessionFactory = session.getSessionFactory();
        final var settings = sessionFactory.getSessionFactoryOptions();
        System.out.println("JDBC Batch Size: " + settings.getJdbcBatchSize());

        // 실행 결과:
        // - Entity Insert Count: 5 (Room 1 + RoomAvailableSlot 4)
        // - Prepared Statement Count: 2 (SQL 종류: room INSERT, room_available_slot INSERT)
        // - JDBC Batch Size: 50 (설정은 적용됨)
        // - 하지만 IDENTITY 전략으로 인해 실제 batch는 동작하지 않음
    }
}
