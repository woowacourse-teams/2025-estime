package com.estime.room.event;

import com.estime.room.RoomSession;

/**
 * 어떤 방의 투표가 바뀌었다는 서버 내부 사실.
 *
 * <p>스프링 애플리케이션 이벤트로 발행되어 서버 안에서만 돈다. 브라우저로 나가는 것은
 * 이것이 아니라 {@link VotesUpdatedEvent} 이고, 둘은 개수도 다르다. 한 방에 변경이 열 번
 * 일어나면 이 사실은 열 번 발행되지만 브라우저로 나가는 신호는 주기당 한 번이다.
 *
 * <p>둘을 한 타입으로 겸하면 서버 사정으로 더한 필드가 브라우저로 새어 나간다.
 */
public record VotesUpdated(
        RoomSession roomSession
) {
}
