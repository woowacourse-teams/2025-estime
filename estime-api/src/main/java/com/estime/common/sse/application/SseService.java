package com.estime.common.sse.application;

import com.github.f4b6a3.tsid.Tsid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SseService {

    private final SseSender sseSender;

    public void sendSseByRoomSession(Tsid roomSession, String message) {
        sseSender.sendMessage(roomSession, message);
    }
}
