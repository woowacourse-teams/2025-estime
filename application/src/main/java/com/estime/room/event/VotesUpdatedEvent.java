package com.estime.room.event;

import com.estime.room.RoomSession;

public record VotesUpdatedEvent(
        RoomSession roomSession
) implements Event {

    @Override
    public String getEventName() {
        return "votes-updated";
    }
}
