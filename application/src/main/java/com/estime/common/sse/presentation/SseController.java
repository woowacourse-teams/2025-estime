package com.estime.common.sse.presentation;

import com.estime.common.sse.application.SseSubscriptionManager;
import com.estime.common.sse.domain.SseConnection;
import com.estime.domain.room.RoomSession;
import com.github.f4b6a3.tsid.Tsid;
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
    public SseEmitter stream(@PathVariable("session") final Tsid roomSession) {
        final SseConnection connection = subscriptionManager.subscribe(RoomSession.from(roomSession));
        return connection.getEmitter();
    }
}
