package com.estime.room.event;

import com.estime.room.RoomSession;

/**
 * 투표가 바뀌었으니 최신 집계를 다시 조회하라는 신호. SSE 로 브라우저에 나간다.
 *
 * <p>값을 싣지 않으므로 몇 번을 보내든 결과가 같다. 그래서 같은 방의 변경 여러 건을
 * 신호 하나로 합칠 수 있다. 값을 실으면 합칠 때 어느 것을 보낼지 정할 수 없어진다.
 *
 * <p>서버 내부에서 발행되는 사실은 {@link VotesUpdated} 다.
 */
public record VotesUpdatedEvent(
        RoomSession roomSession
) implements Event {

    @Override
    public String getEventName() {
        return "votes-updated";
    }
}
