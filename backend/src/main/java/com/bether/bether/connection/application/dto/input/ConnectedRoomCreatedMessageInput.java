package com.bether.bether.connection.application.dto.input;

import java.time.LocalDateTime;

public record ConnectedRoomCreatedMessageInput(
        String title,
        LocalDateTime deadLine,
        String connectedRoomCreatedUrl
) {
}
