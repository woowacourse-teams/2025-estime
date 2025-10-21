package com.estime.sse;

import com.estime.port.out.RoomMessageSender;
import com.estime.room.RoomSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SseRoomMessageSender implements RoomMessageSender {

    private final SseSender sseSender;

    @Override
    public void sendMessage(final RoomSession roomSession, final String message) {
        sseSender.broadcast(roomSession, message);
    }
}
