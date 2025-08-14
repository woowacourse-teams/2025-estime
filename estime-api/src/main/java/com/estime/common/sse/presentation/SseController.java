package com.estime.common.sse.presentation;

import com.estime.common.sse.application.SseSubscriptionManager;
import com.github.f4b6a3.tsid.Tsid;
import java.io.IOException;
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

    @GetMapping(value = "/rooms/{session}/stream")
    public SseEmitter stream(@PathVariable("session") final Tsid roomSession) {
        final SseEmitter emitter = subscriptionManager.subscribe(roomSession);
        try {
            emitter.send(SseEmitter.event().data("connected"));
        } catch (IOException e) {
            emitter.complete();
        }
        return emitter;
    }
}
