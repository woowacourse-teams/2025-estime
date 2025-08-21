package com.estime.common.sse.application;

import com.estime.common.sse.domain.SseEmitters;
import com.github.f4b6a3.tsid.Tsid;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
@RequiredArgsConstructor
public class SseSubscriptionManager {

    private static final Duration TIMEOUT_DURATION = Duration.ofMinutes(5);

    private final SseEmitters sseEmitters;

    public SseEmitter subscribe(final Tsid roomSession) {
        final String emitterId = createEmitterId(roomSession);
        return initEmitter(emitterId);
    }

    private SseEmitter initEmitter(final String emitterId) {
        final SseEmitter emitter = sseEmitters.save(emitterId, new SseEmitter(TIMEOUT_DURATION.toMillis()));
        setupLifeCycle(emitter, emitterId);
        return emitter;
    }

    private String createEmitterId(final Tsid roomSession) {
        return roomSession.toString() + "_" + System.currentTimeMillis();
    }

    private void setupLifeCycle(final SseEmitter emitter, final String emitterId) {
        emitter.onCompletion(() -> sseEmitters.deleteById(emitterId));
        emitter.onTimeout(() -> sseEmitters.deleteById(emitterId));
    }
}
