package com.estime.connection.application.dto.input;

import com.estime.room.domain.vo.DateTimeSlot;
import com.estime.room.domain.Room;

public record ConnectedRoomCreatedMessageInput(
        String shortcut,
        String title,
        DateTimeSlot deadline
) {

    public static ConnectedRoomCreatedMessageInput of(
            final String shortcut,
            final Room room
    ) {
        return new ConnectedRoomCreatedMessageInput(shortcut, room.getTitle(), room.getDeadline());
    }
}
