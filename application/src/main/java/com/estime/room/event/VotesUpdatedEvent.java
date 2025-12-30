package com.estime.room.event;

public record VotesUpdatedEvent(String participantName) implements Event {

    @Override
    public String getEventName() {
        return "votes-updated";
    }
}
