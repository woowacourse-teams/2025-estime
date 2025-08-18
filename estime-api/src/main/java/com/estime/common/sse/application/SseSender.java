package com.estime.common.sse.application;

import com.estime.common.sse.domain.SseEmitters;
import com.github.f4b6a3.tsid.Tsid;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
@RequiredArgsConstructor
public class SseSender {

    private final SseEmitters sseEmitters;

    public void sendMessage(Tsid roomSession, String message) {
        final List<SseEmitter> emitters = sseEmitters.findAllByRoomSession(roomSession);
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().data(message));
            } catch (IOException e) {
                throw new RuntimeException("Failed to send SSE message for roomSession " + roomSession + ":" + e.getMessage(), e);
            }
        }
    }
}
