package com.estime.room.event;

import com.estime.room.RoomSession;

/**
 * 투표가 바뀌었다는 서버 내부 사실. 브라우저로 나가는 것은 {@link VotesUpdatedEvent} 다.
 */
public record VotesUpdated(
        RoomSession roomSession
) {
}
