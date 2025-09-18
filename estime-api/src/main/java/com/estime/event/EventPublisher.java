package com.estime.event;

// 이벤트 퍼블리셔(포트)
public interface EventPublisher<T extends Event> {
    void publish(T event);
}
