package com.estime.sse;

import com.estime.room.RoomSession;
import com.estime.room.event.ConnectedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SseSubscriptionManager {

    private final SseConnectionManager sseConnectionManager;
    private final SseSender sseSender;

    public SseConnection subscribe(final RoomSession session) {
        final SseConnection connection = sseConnectionManager.init(session);
        sseSender.send(connection, new ConnectedEvent());
        return connection;
    }
}
