package com.estime.room.event;

import com.estime.room.RoomSession;

/**
 * 최신 집계를 다시 조회하라는 신호. 값을 싣지 않아 몇 번을 보내든 결과가 같고, 그래서 같은
 * 방의 변경 여러 건을 하나로 합칠 수 있다. 필드를 더하면 합칠 때 어느 것을 보낼지 정할 수
 * 없어진다. 서버 내부 사실은 {@link VotesUpdated} 다.
 */
public record VotesUpdatedEvent(
        RoomSession roomSession
) implements Event {

    @Override
    public String getEventName() {
        return "votes-updated";
    }
}
