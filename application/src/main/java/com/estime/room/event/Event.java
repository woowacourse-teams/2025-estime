package com.estime.room.event;

/**
 * SSE 로 브라우저에 나가는 페이로드.
 *
 * <p>{@code getEventName()} 이 SSE 이벤트 이름이 되고 구현체는 그대로 직렬화되어 나간다.
 * 즉 이 계층은 클라이언트와의 계약이므로, 서버 내부 사정으로 필드를 더하면 그대로 노출된다.
 * 서버 안에서만 도는 사실은 이 계층을 쓰지 않는다.
 */
public interface Event {

    String getEventName();
}
