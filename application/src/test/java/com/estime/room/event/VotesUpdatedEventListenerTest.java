package com.estime.room.event;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.estime.cache.CacheNames;
import com.estime.port.out.RoomEventSender;
import com.estime.room.RoomSession;
import java.util.concurrent.Executor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;

@ExtendWith(MockitoExtension.class)
class VotesUpdatedEventListenerTest {

    private static final Executor SAME_THREAD = Runnable::run;

    @Mock
    private RoomEventSender roomEventSender;

    private CacheManager cacheManager;
    private VotesUpdatedEventListener listener;

    @BeforeEach
    void setUp() {
        cacheManager = new ConcurrentMapCacheManager(CacheNames.VOTE_STATISTIC);
        listener = new VotesUpdatedEventListener(roomEventSender, cacheManager, SAME_THREAD);
    }

    @DisplayName("이벤트를 받고 flush 하면 그 방으로 SSE를 전송한다.")
    @Test
    void flush_sendsEventForDirtyRoom() {
        final RoomSession roomSession = RoomSession.from("test-session");

        listener.handle(new VotesUpdatedEvent(roomSession));
        listener.flush();

        verify(roomEventSender).sendEvent(eq(roomSession), any(VotesUpdatedEvent.class));
    }

    @DisplayName("같은 방에 이벤트가 여러 번 와도 flush 한 번에 한 번만 전송된다.")
    @Test
    void flush_coalescesEventsForSameRoom() {
        final RoomSession roomSession = RoomSession.from("test-session");

        for (int i = 0; i < 10; i++) {
            listener.handle(new VotesUpdatedEvent(roomSession));
        }
        listener.flush();

        verify(roomEventSender, times(1)).sendEvent(eq(roomSession), any(VotesUpdatedEvent.class));
    }

    @DisplayName("다른 방의 이벤트는 각각 전송된다.")
    @Test
    void flush_sendsEventForEachRoom() {
        for (int i = 0; i < 10; i++) {
            listener.handle(new VotesUpdatedEvent(RoomSession.from("session-" + i)));
        }
        listener.flush();

        verify(roomEventSender, times(10)).sendEvent(any(RoomSession.class), any(VotesUpdatedEvent.class));
    }

    @DisplayName("이벤트가 없으면 전송하지 않는다.")
    @Test
    void flush_doesNothingWhenNoEvent() {
        listener.flush();

        verify(roomEventSender, never()).sendEvent(any(RoomSession.class), any(VotesUpdatedEvent.class));
    }

    @DisplayName("flush 후 같은 방에 이벤트가 다시 오면 다음 flush 에서 전송된다.")
    @Test
    void flush_sendsAgainForEventAfterFlush() {
        final RoomSession roomSession = RoomSession.from("test-session");

        listener.handle(new VotesUpdatedEvent(roomSession));
        listener.flush();
        listener.handle(new VotesUpdatedEvent(roomSession));
        listener.flush();

        verify(roomEventSender, times(2)).sendEvent(eq(roomSession), any(VotesUpdatedEvent.class));
    }

    @DisplayName("SSE 전송이 실패해도 예외를 던지지 않는다.")
    @Test
    void flush_doesNotThrowWhenSendFails() {
        final RoomSession roomSession = RoomSession.from("test-session");
        doThrow(new RuntimeException()).when(roomEventSender)
                .sendEvent(eq(roomSession), any(VotesUpdatedEvent.class));

        listener.handle(new VotesUpdatedEvent(roomSession));

        assertThatCode(() -> listener.flush()).doesNotThrowAnyException();
    }

    @DisplayName("이벤트를 받으면 그 방의 투표 통계 캐시를 비운다.")
    @Test
    void handle_evictsVoteStatisticCache() {
        final RoomSession roomSession = RoomSession.from("test-session");
        final Cache cache = cacheManager.getCache(CacheNames.VOTE_STATISTIC);
        cache.put(roomSession, "stale");

        listener.handle(new VotesUpdatedEvent(roomSession));

        assertThat(cache.get(roomSession)).isNull();
    }

    @DisplayName("다른 방의 캐시는 비우지 않는다.")
    @Test
    void handle_doesNotEvictOtherRoomCache() {
        final RoomSession target = RoomSession.from("target");
        final RoomSession other = RoomSession.from("other");
        final Cache cache = cacheManager.getCache(CacheNames.VOTE_STATISTIC);
        cache.put(other, "keep");

        listener.handle(new VotesUpdatedEvent(target));

        assertThat(cache.get(other)).isNotNull();
    }
}
