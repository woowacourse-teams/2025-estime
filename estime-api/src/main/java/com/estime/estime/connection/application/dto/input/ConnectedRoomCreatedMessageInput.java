package com.estime.estime.connection.application.dto.input;

import com.estime.estime.room.domain.Room;
import java.time.LocalDateTime;

public record ConnectedRoomCreatedMessageInput(
        String shortcut,
        String title,
        LocalDateTime deadLine
) {

    public static ConnectedRoomCreatedMessageInput of(
            final String shortcut,
            final Room room
    ) {
        return new ConnectedRoomCreatedMessageInput(shortcut, room.getTitle(), room.getDeadLine());
    }
}
