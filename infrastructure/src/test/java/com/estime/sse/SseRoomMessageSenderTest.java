package com.estime.sse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

import com.estime.room.RoomSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class SseRoomMessageSenderTest {

    private SseConnectionManager sseConnectionManager;
    private SseSender sseSender;
    private SseRoomMessageSender sseRoomMessageSender;

    private RoomSession session;

    @BeforeEach
    void setUp() {
        sseConnectionManager = new SseConnectionManager();
        sseSender = new SseSender(sseConnectionManager);
        sseRoomMessageSender = new SseRoomMessageSender(sseSender);
        session = RoomSession.from("test-session");
    }

    @DisplayName("sendMessage() - 방 세션에 메시지를 브로드캐스트한다")
    @Test
    void sendMessage() {
        // given
        final String message = "test-message";
        final SseConnection connection = SseConnection.init(session);
        sseConnectionManager.save(session, connection);

        // when & then: 예외 발생하지 않음
        assertThatCode(() -> sseRoomMessageSender.sendMessage(session, message))
                .doesNotThrowAnyException();

        // 연결이 여전히 유지됨
        assertThat(sseConnectionManager.findAll(session)).contains(connection);
    }
}
