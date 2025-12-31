package com.estime.port.out;

import com.estime.room.RoomSession;
import com.estime.room.event.Event;

public interface RoomEventSender {

    void sendEvent(RoomSession roomSession, Event event);
}
