package com.estime.sse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.RoomSession;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class SseConnectionManagerTest {

    private SseConnectionManager sseConnectionManager;
    private RoomSession session;

    @BeforeEach
    void setUp() {
        sseConnectionManager = new SseConnectionManager();
        session = RoomSession.from("test-session");
    }

    @DisplayName("save() - SSE 연결을 저장한다")
    @Test
    void save() {
        // given
        final SseConnection connection = SseConnection.init(session);

        // when
        final SseConnection saved = sseConnectionManager.save(session, connection);

        // then
        assertSoftly(softly -> {
            softly.assertThat(saved).isEqualTo(connection);
            softly.assertThat(sseConnectionManager.findAll(session)).contains(connection);
        });
    }

    @DisplayName("save() - 같은 세션에 여러 연결을 저장할 수 있다")
    @Test
    void save_multipleConnections() {
        // given
        final SseConnection connection1 = SseConnection.init(session);
        final SseConnection connection2 = SseConnection.init(session);

        // when
        sseConnectionManager.save(session, connection1);
        sseConnectionManager.save(session, connection2);

        // then
        final List<SseConnection> connections = sseConnectionManager.findAll(session);
        assertSoftly(softly -> {
            softly.assertThat(connections).hasSize(2);
            softly.assertThat(connections).containsExactlyInAnyOrder(connection1, connection2);
        });
    }

    @DisplayName("findAll() - 세션의 모든 연결을 조회한다")
    @Test
    void findAll() {
        // given
        final SseConnection connection1 = SseConnection.init(session);
        final SseConnection connection2 = SseConnection.init(session);
        sseConnectionManager.save(session, connection1);
        sseConnectionManager.save(session, connection2);

        // when
        final List<SseConnection> connections = sseConnectionManager.findAll(session);

        // then
        assertSoftly(softly -> {
            softly.assertThat(connections).hasSize(2);
            softly.assertThat(connections).containsExactlyInAnyOrder(connection1, connection2);
        });
    }

    @DisplayName("findAll() - 존재하지 않는 세션 조회 시 빈 리스트를 반환한다")
    @Test
    void findAll_nonExistentSession() {
        // given
        final RoomSession nonExistentSession = RoomSession.from("non-existent");

        // when
        final List<SseConnection> connections = sseConnectionManager.findAll(nonExistentSession);

        // then
        assertThat(connections).isEmpty();
    }

    @DisplayName("delete() - 연결을 삭제한다")
    @Test
    void delete() {
        // given
        final SseConnection connection = SseConnection.init(session);
        sseConnectionManager.save(session, connection);

        // when
        sseConnectionManager.delete(session, connection);

        // then
        assertThat(sseConnectionManager.findAll(session)).isEmpty();
    }

    @DisplayName("delete() - 마지막 연결 삭제 시 세션도 함께 제거한다")
    @Test
    void delete_removeSessionWhenEmpty() {
        // given
        final SseConnection connection1 = SseConnection.init(session);
        final SseConnection connection2 = SseConnection.init(session);
        sseConnectionManager.save(session, connection1);
        sseConnectionManager.save(session, connection2);

        // when
        sseConnectionManager.delete(session, connection1);

        // then
        assertThat(sseConnectionManager.findAll(session)).containsExactly(connection2);

        // when: 마지막 연결 삭제
        sseConnectionManager.delete(session, connection2);

        // then: 세션도 제거되어 빈 리스트 반환
        assertThat(sseConnectionManager.findAll(session)).isEmpty();
    }

    @DisplayName("delete() - 존재하지 않는 세션 삭제 시 아무 동작도 하지 않는다")
    @Test
    void delete_nonExistentSession() {
        // given
        final RoomSession nonExistentSession = RoomSession.from("non-existent");
        final SseConnection connection = SseConnection.init(nonExistentSession);

        // when & then: 예외 발생하지 않음
        sseConnectionManager.delete(nonExistentSession, connection);
    }

    @DisplayName("여러 세션의 연결을 독립적으로 관리한다")
    @Test
    void manageMultipleSessions() {
        // given
        final RoomSession session1 = RoomSession.from("session-1");
        final RoomSession session2 = RoomSession.from("session-2");

        final SseConnection connection1 = SseConnection.init(session1);
        final SseConnection connection2 = SseConnection.init(session2);

        // when
        sseConnectionManager.save(session1, connection1);
        sseConnectionManager.save(session2, connection2);

        // then
        assertSoftly(softly -> {
            softly.assertThat(sseConnectionManager.findAll(session1)).containsExactly(connection1);
            softly.assertThat(sseConnectionManager.findAll(session2)).containsExactly(connection2);
        });

        // when: session1 연결 삭제
        sseConnectionManager.delete(session1, connection1);

        // then: session2는 영향받지 않음
        assertSoftly(softly -> {
            softly.assertThat(sseConnectionManager.findAll(session1)).isEmpty();
            softly.assertThat(sseConnectionManager.findAll(session2)).containsExactly(connection2);
        });
    }
}
