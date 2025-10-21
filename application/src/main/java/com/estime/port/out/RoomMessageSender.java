package com.estime.port.out;

import com.estime.room.RoomSession;

public interface RoomMessageSender {

    void sendMessage(RoomSession roomSession, String message);
}
