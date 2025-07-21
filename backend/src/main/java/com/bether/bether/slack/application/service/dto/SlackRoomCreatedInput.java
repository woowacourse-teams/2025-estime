package com.bether.bether.slack.application.service.dto;

import com.bether.bether.room.presentation.dto.request.RoomCreateRequest;
import com.bether.bether.room.presentation.dto.response.RoomCreateResponse;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record SlackRoomCreatedInput(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTime,
        LocalTime endTime,
        String session
) {

    public static SlackRoomCreatedInput from(final RoomCreateRequest request, final RoomCreateResponse response) {
        return new SlackRoomCreatedInput(
                request.title(),
                request.availableDates(),
                request.startTime(),
                request.endTime(),
                response.session()
        );
    }
}
