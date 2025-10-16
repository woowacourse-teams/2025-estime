package com.estime.sse.controller;

import com.estime.room.RoomSession;
import com.estime.sse.SseConnection;
import com.estime.sse.SseSubscriptionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Controller
@RequestMapping("/api/v1/sse")
@RequiredArgsConstructor
@Slf4j
public class SseController {

    private final SseSubscriptionManager subscriptionManager;

    @GetMapping("/rooms/{session}/stream")
    public SseEmitter stream(@PathVariable("session") final String roomSession) {
        final SseConnection connection = subscriptionManager.subscribe(RoomSession.from(roomSession));
        return connection.getEmitter();
    }
}
