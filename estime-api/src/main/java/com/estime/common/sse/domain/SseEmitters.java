package com.estime.common.sse.domain;

import com.github.f4b6a3.tsid.Tsid;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class SseEmitters {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter save(final String emitterId, final SseEmitter sseEmitter) {
        emitters.put(emitterId, sseEmitter);
        return sseEmitter;
    }

    public Map<String, SseEmitter> findAllByRoomSession(final Tsid roomSession) {
        return emitters.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(roomSession.toString()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public void deleteById(final String emitterId) {
        emitters.remove(emitterId);
    }

    public void deleteAllByRoomSession(final Tsid roomSession) {
        emitters.keySet().stream()
                .filter(key -> key.startsWith(roomSession.toString()))
                .forEach(emitters::remove);
    }
}
