package com.estime.common.sse.application;

import com.estime.room.domain.vo.RoomSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SseService {

    private final SseSender sseSender;

    public void sendMessageByRoomSession(final RoomSession session, final String message) {
        sseSender.broadcast(session, message);
    }
}
