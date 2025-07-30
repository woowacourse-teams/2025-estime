package com.estime.estime.room.application.dto;

import com.estime.estime.room.domain.Room;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record RoomOutput(
        String title,
        List<LocalDate> availableDates,
        LocalTime startTime,
        LocalTime endTime,
        LocalDateTime deadLine,
        boolean isPublic,
        String roomSession
) {

    public static RoomOutput from(final Room room) {
        return new RoomOutput(
                room.getTitle(),
                room.getAvailableDates(),
                room.getStartTime(),
                room.getEndTime(),
                room.getDeadLine(),
                room.isPublic(),
                room.getSession()
        );
    }
}
