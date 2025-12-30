package com.estime.sse;

import com.estime.port.out.RoomEventSender;
import com.estime.room.RoomSession;
import com.estime.room.event.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SseRoomEventSender implements RoomEventSender {

    private final SseSender sseSender;

    @Override
    public void sendEvent(final RoomSession roomSession, final Event event) {
        sseSender.broadcast(roomSession, event);
    }
}
