package com.bether.bether.connection.application.dto.input;

import com.bether.bether.room.domain.Room;
import java.time.LocalDateTime;

public record ConnectedRoomCreatedMessageInput(
        String shortcut,
        String title,
        LocalDateTime deadLine
) {

    public static ConnectedRoomCreatedMessageInput of(
            String shortcut,
            Room room
    ) {
        return new ConnectedRoomCreatedMessageInput(shortcut, room.getTitle(), room.getDeadLine());
    }
}
