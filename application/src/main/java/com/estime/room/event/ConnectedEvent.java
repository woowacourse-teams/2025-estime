package com.estime.room.event;

public record ConnectedEvent() implements Event {

    @Override
    public String getEventName() {
        return "connected";
    }
}
