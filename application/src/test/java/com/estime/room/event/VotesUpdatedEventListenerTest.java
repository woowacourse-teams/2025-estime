package com.estime.room.event;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.estime.cache.CacheNames;
import com.estime.port.out.RoomEventSender;
import com.estime.room.RoomSession;
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicReference;
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

    @DisplayName("이벤트를 받으면 그 방으로 SSE를 전송한다.")
    @Test
    void handle_sendsEventToRoom() {
        final RoomSession roomSession = RoomSession.from("test-session");

        listener.handle(new VotesUpdated(roomSession));

        verify(roomEventSender).sendEvent(eq(roomSession), any(VotesUpdatedEvent.class));
    }

    @DisplayName("같은 방에 이벤트가 여러 번 오면 합치지 않고 그만큼 전송한다.")
    @Test
    void handle_sendsForEveryEventWithoutCoalescing() {
        final RoomSession roomSession = RoomSession.from("test-session");

        for (int i = 0; i < 3; i++) {
            listener.handle(new VotesUpdated(roomSession));
        }

        verify(roomEventSender, times(3)).sendEvent(eq(roomSession), any(VotesUpdatedEvent.class));
    }

    @DisplayName("캐시를 비운 뒤에 SSE를 전송한다.")
    @Test
    void handle_evictsCacheBeforeSending() {
        final RoomSession roomSession = RoomSession.from("test-session");
        final Cache cache = cacheManager.getCache(CacheNames.VOTE_STATISTIC);
        cache.put(roomSession, "stale");
        final AtomicReference<Cache.ValueWrapper> cachedAtSend = new AtomicReference<>(() -> "not-sent");
        doAnswer(invocation -> {
            cachedAtSend.set(cache.get(roomSession));
            return null;
        }).when(roomEventSender).sendEvent(eq(roomSession), any(VotesUpdatedEvent.class));

        listener.handle(new VotesUpdated(roomSession));

        assertThat(cachedAtSend.get()).isNull();
    }

    @DisplayName("SSE 전송이 실패해도 예외를 던지지 않는다.")
    @Test
    void handle_doesNotThrowWhenSendFails() {
        final RoomSession roomSession = RoomSession.from("test-session");
        doThrow(new RuntimeException()).when(roomEventSender)
                .sendEvent(eq(roomSession), any(VotesUpdatedEvent.class));

        assertThatCode(() -> listener.handle(new VotesUpdated(roomSession))).doesNotThrowAnyException();
    }

    @DisplayName("이벤트를 받으면 그 방의 투표 통계 캐시를 비운다.")
    @Test
    void handle_evictsVoteStatisticCache() {
        final RoomSession roomSession = RoomSession.from("test-session");
        final Cache cache = cacheManager.getCache(CacheNames.VOTE_STATISTIC);
        cache.put(roomSession, "stale");

        listener.handle(new VotesUpdated(roomSession));

        assertThat(cache.get(roomSession)).isNull();
    }

    @DisplayName("다른 방의 캐시는 비우지 않는다.")
    @Test
    void handle_doesNotEvictOtherRoomCache() {
        final RoomSession target = RoomSession.from("target");
        final RoomSession other = RoomSession.from("other");
        final Cache cache = cacheManager.getCache(CacheNames.VOTE_STATISTIC);
        cache.put(other, "keep");

        listener.handle(new VotesUpdated(target));

        assertThat(cache.get(other)).isNotNull();
    }
}
