package com.estime.room.event;

import com.estime.room.RoomSession;

/**
 * 최신 집계를 다시 조회하라는 신호. 값을 싣지 않아 몇 번을 보내든 결과가 같으므로, 큐가 넘칠 때
 * 오래된 신호를 버려도 된다. 필드를 더하면 성립하지 않는다. 서버 내부 사실은 {@link VotesUpdated} 다.
 */
public record VotesUpdatedEvent(
        RoomSession roomSession
) implements Event {

    @Override
    public String getEventName() {
        return "votes-updated";
    }
}
