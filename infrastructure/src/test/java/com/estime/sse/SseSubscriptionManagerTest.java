package com.estime.sse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.RoomSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class SseSubscriptionManagerTest {

    private SseConnectionManager sseConnectionManager;
    private SseSender sseSender;
    private SseSubscriptionManager sseSubscriptionManager;

    private RoomSession session;

    @BeforeEach
    void setUp() {
        sseConnectionManager = new SseConnectionManager();
        sseSender = new SseSender(sseConnectionManager);
        sseSubscriptionManager = new SseSubscriptionManager(sseConnectionManager, sseSender);
        session = RoomSession.from("test-session");
    }

    @DisplayName("subscribe() - SSE 구독을 생성하고 연결 메시지를 전송한다")
    @Test
    void subscribe() {
        // when
        final SseConnection connection = sseSubscriptionManager.subscribe(session);

        // then
        assertSoftly(softly -> {
            softly.assertThat(connection).isNotNull();
            softly.assertThat(connection.getEmitter()).isNotNull();
            softly.assertThat(sseConnectionManager.findAll(session)).contains(connection);
        });
    }

    @DisplayName("subscribe() - 구독 시 emitter 라이프사이클이 설정된다")
    @Test
    void subscribe_setupLifeCycle() {
        // when
        final SseConnection connection = sseSubscriptionManager.subscribe(session);

        // then: emitter가 생성되고 저장됨
        assertSoftly(softly -> {
            softly.assertThat(connection.getEmitter()).isNotNull();
            softly.assertThat(sseConnectionManager.findAll(session)).hasSize(1);
            softly.assertThat(sseConnectionManager.findAll(session)).contains(connection);
        });
    }
}
