package com.bether.bether.timeslot.application.dto.input;

import java.util.UUID;

public record TimeSlotRankInput(
        UUID roomSession
) {

    public static TimeSlotRankInput toInput(UUID roomSession) {
        return new TimeSlotRankInput(roomSession);
    }
}
