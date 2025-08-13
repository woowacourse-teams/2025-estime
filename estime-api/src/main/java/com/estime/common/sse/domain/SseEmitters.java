package com.estime.common.sse.domain;

import com.github.f4b6a3.tsid.Tsid;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class SseEmitters {

    private final Map<String, SseEmitter> idToEmitter = new ConcurrentHashMap<>();

    public SseEmitter save(final String emitterId, final SseEmitter sseEmitter) {
        idToEmitter.put(emitterId, sseEmitter);
        return sseEmitter;
    }

    public List<SseEmitter> findAllByRoomSession(final Tsid roomSession) {
        return idToEmitter.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(roomSession.toString()))
                .map(Map.Entry::getValue)
                .collect(Collectors.toList());
    }

    public void deleteById(final String emitterId) {
        idToEmitter.remove(emitterId);
    }

    public void deleteAllByRoomSession(final Tsid roomSession) {
        idToEmitter.keySet().stream()
                .filter(key -> key.startsWith(roomSession.toString()))
                .forEach(idToEmitter::remove);
    }
}
