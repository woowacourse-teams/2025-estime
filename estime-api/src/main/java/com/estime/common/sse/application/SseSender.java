package com.estime.common.sse.application;

import com.estime.common.sse.domain.SseEmitters;
import com.estime.common.sse.presentation.dto.SseResponse;
import com.github.f4b6a3.tsid.Tsid;
import com.github.f4b6a3.tsid.TsidCreator;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
@RequiredArgsConstructor
public class SseSender {

    private final SseEmitters sseEmitters;

    public void broadcast(final Tsid roomSession, final String message) {
        final List<SseEmitter> emitters = sseEmitters.findAllByRoomSession(roomSession);
        for (final SseEmitter emitter : emitters) {
            try {
                emitter.send(
                        SseEmitter.event()
                                .name(message)
                                .id(TsidCreator.getTsid().toString())
                                .data(SseResponse.from("ok"))
                );
            } catch (final IOException e) {
                throw new RuntimeException(
                        "Failed to send SSE message for roomSession " + roomSession + ":" + e.getMessage(), e);
            }
        }
    }
}
