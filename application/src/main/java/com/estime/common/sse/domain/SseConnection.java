package com.estime.common.sse.domain;

import com.estime.domain.room.RoomSession;
import java.io.IOException;
import java.time.Duration;
import java.util.UUID;
import java.util.function.BiConsumer;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.SseEventBuilder;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class SseConnection {

    private static final Duration TIMEOUT_DURATION = Duration.ofMinutes(5);

    private final UUID id;
    private final RoomSession session;
    private final SseEmitter emitter;

    public static SseConnection init(final RoomSession session) {
        return new SseConnection(
                UUID.randomUUID(),
                session,
                new SseEmitter(TIMEOUT_DURATION.toMillis())
        );
    }

    public void send(
            final SseEventBuilder eventBuilder,
            final BiConsumer<RoomSession, SseConnection> onFailure
    ) {
        try {
            emitter.send(eventBuilder);
        } catch (final IOException e) {
            onFailure.accept(session, this);
        }
    }
}
