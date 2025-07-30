package com.estime.estime.connection.presentation.dto.request;

import com.estime.estime.connection.application.dto.input.ConnectedRoomCreateInput;
import com.estime.estime.connection.domain.Platform;
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
