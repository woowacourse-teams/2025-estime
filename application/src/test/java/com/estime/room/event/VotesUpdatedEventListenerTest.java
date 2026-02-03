package com.estime.room.event;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import com.estime.port.out.RoomEventSender;
import com.estime.room.RoomSession;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class VotesUpdatedEventListenerTest {

    @Mock
    private RoomEventSender roomEventSender;

    @InjectMocks
    private VotesUpdatedEventListener listener;

    @DisplayName("VotesUpdatedEvent를 받으면 RoomEventSender로 SSE를 전송한다.")
    @Test
    void handle_sendsEventToRoomEventSender() {
        // given
        final RoomSession roomSession = RoomSession.from("test-session");
        final VotesUpdatedEvent event = new VotesUpdatedEvent(roomSession, "participantName");

        // when
        listener.handle(event);

        // then
        verify(roomEventSender).sendEvent(roomSession, event);
    }

    @DisplayName("SSE 전송 실패 시 예외를 던지지 않는다.")
    @Test
    void handle_doesNotThrowWhenSendFails() {
        // given
        final RoomSession roomSession = RoomSession.from("test-session");
        final VotesUpdatedEvent event = new VotesUpdatedEvent(roomSession, "participantName");
        doThrow(new RuntimeException()).when(roomEventSender).sendEvent(roomSession, event);

        // when & then (예외 발생하지 않음)
        assertThatCode(() -> listener.handle(event)).doesNotThrowAnyException();
    }
}
