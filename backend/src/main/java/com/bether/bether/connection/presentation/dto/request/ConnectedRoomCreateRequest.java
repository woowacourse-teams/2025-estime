package com.bether.bether.connection.presentation.dto.request;

import com.bether.bether.connection.application.dto.input.ConnectedRoomCreateInput;
import com.bether.bether.connection.domain.Platform;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record ConnectedRoomCreateRequest(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTime,
        LocalTime endTime,
        LocalDateTime deadLine,
        Boolean isPublic,
        Platform platform,
        String channelId
) {

    public ConnectedRoomCreateInput toInput() {
        return new ConnectedRoomCreateInput(
                title, availableDates, startTime, endTime, deadLine, isPublic, platform, channelId
        );
    }
}
