package com.estime.common.sse.presentation;

import com.estime.common.sse.presentation.dto.SseInitMessage;
import com.estime.common.sse.application.service.SseService;
import com.github.f4b6a3.tsid.Tsid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;

    @GetMapping("/rooms/{session}/stream")
    public SseEmitter stream(@PathVariable("session") final Tsid roomSession) {
        return sseService.connect(roomSession);
    }

    @GetMapping("/rooms/{session}/stream/test")
    public SseInitMessage streamTest(@PathVariable("session") final Tsid roomSession) {
        sseService.connect(roomSession);
        return SseInitMessage.createMessage(roomSession);
    }
}
