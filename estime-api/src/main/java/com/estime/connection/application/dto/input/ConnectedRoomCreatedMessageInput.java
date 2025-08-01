package com.estime.connection.application.dto.input;

import com.estime.datetimeslot.DateTimeSlot;
import com.estime.room.domain.Room;

public record ConnectedRoomCreatedMessageInput(
        String shortcut,
        String title,
        DateTimeSlot deadLine
) {

    public static ConnectedRoomCreatedMessageInput of(
            final String shortcut,
            final Room room
    ) {
        return new ConnectedRoomCreatedMessageInput(shortcut, room.getTitle(), room.getDeadLine());
    }
}
