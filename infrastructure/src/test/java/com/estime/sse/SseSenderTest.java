package com.estime.sse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.RoomSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class SseSenderTest {

    private SseConnectionManager sseConnectionManager;
    private SseSender sseSender;

    private RoomSession session;
    private SseConnection connection;

    @BeforeEach
    void setUp() {
        sseConnectionManager = new SseConnectionManager();
        sseSender = new SseSender(sseConnectionManager);
        session = RoomSession.from("test-session");
        connection = SseConnection.init(session);
    }

    @DisplayName("send() - SSE 연결에 메시지를 전송한다")
    @Test
    void send() {
        // when & then: IOException이 발생하지 않으면 정상 전송
        assertThatCode(() -> sseSender.send(connection, "test-message"))
                .doesNotThrowAnyException();
    }

    @DisplayName("broadcast() - 세션의 모든 연결에 메시지를 브로드캐스트한다")
    @Test
    void broadcast() {
        // given
        final SseConnection connection1 = SseConnection.init(session);
        final SseConnection connection2 = SseConnection.init(session);
        sseConnectionManager.save(session, connection1);
        sseConnectionManager.save(session, connection2);

        // when
        sseSender.broadcast(session, "broadcast-message");

        // then: 모든 연결이 여전히 저장되어 있음
        assertSoftly(softly -> {
            softly.assertThat(sseConnectionManager.findAll(session)).hasSize(2);
            softly.assertThat(sseConnectionManager.findAll(session)).contains(connection1, connection2);
        });
    }

    @DisplayName("broadcast() - 연결이 없는 세션에 브로드캐스트해도 예외가 발생하지 않는다")
    @Test
    void broadcast_noConnections() {
        // when & then: 예외 발생하지 않음
        assertThatCode(() -> sseSender.broadcast(session, "broadcast-message"))
                .doesNotThrowAnyException();
    }
}
