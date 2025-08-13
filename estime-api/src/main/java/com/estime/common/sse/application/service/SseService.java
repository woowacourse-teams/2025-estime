package com.estime.common.sse.application.service;

import com.github.f4b6a3.tsid.Tsid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
@RequiredArgsConstructor
public class SseService {

    private final SseSubscriptionManager subscriptionManager;

    public SseEmitter connect(final Tsid roomSession) {
        return subscriptionManager.subscribe(roomSession);
    }
}
