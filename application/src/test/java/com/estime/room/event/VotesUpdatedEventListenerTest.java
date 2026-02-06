package com.estime.room.event;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.estime.port.out.RoomEventSender;
import com.estime.room.RoomSession;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
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

        // when & then
        assertThatCode(() -> listener.handle(event)).doesNotThrowAnyException();
    }

    @DisplayName("같은 방에 대해 동시에 여러 이벤트가 발생하면 한 번만 전송된다.")
    @Test
    void handle_coalescesDuplicateEventsForSameRoom() throws InterruptedException {
        // given
        final RoomSession roomSession = RoomSession.from("test-session");
        final int eventCount = 10;
        final CountDownLatch handleReturned = new CountDownLatch(eventCount - 1);

        doAnswer(invocation -> {
            handleReturned.await();
            return null;
        }).when(roomEventSender).sendEvent(eq(roomSession), any(VotesUpdatedEvent.class));

        final ExecutorService executor = Executors.newFixedThreadPool(eventCount);

        // when
        for (int i = 0; i < eventCount; i++) {
            final String participantName = "participant" + i;
            executor.submit(() -> {
                final VotesUpdatedEvent event = new VotesUpdatedEvent(roomSession, participantName);
                listener.handle(event);
                handleReturned.countDown();
            });
        }

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        // then
        verify(roomEventSender, times(1)).sendEvent(eq(roomSession), any(VotesUpdatedEvent.class));
    }

    @DisplayName("다른 방에 대해 동시에 여러 이벤트가 발생하면 모두 전송된다.")
    @Test
    void handle_processesEventsForDifferentRoomsIndependently() throws InterruptedException {
        // given
        final int eventCount = 10;
        final CountDownLatch startLatch = new CountDownLatch(1);
        final ExecutorService executor = Executors.newFixedThreadPool(eventCount);

        // when
        for (int i = 0; i < eventCount; i++) {
            final RoomSession roomSession = RoomSession.from("session-" + i);
            final String participantName = "participant" + i;
            executor.submit(() -> {
                try {
                    startLatch.await();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                final VotesUpdatedEvent event = new VotesUpdatedEvent(roomSession, participantName);
                listener.handle(event);
            });
        }

        startLatch.countDown();
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        // then
        verify(roomEventSender, times(eventCount)).sendEvent(any(RoomSession.class), any(VotesUpdatedEvent.class));
    }
}
