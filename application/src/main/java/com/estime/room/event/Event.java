package com.estime.room.event;

/**
 * SSE 로 브라우저에 나가는 페이로드. 구현체는 그대로 직렬화되므로 필드를 더하면 그만큼
 * 클라이언트에 노출된다. 서버 안에서만 도는 사실은 이 계층을 쓰지 않는다.
 */
public interface Event {

    String getEventName();
}
