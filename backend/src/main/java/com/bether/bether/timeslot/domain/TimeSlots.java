package com.bether.bether.timeslot.domain;

import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TimeSlots {

    private final List<TimeSlot> timeSlots;

    public static TimeSlots from(final List<TimeSlot> timeSlots) {
        return new TimeSlots(timeSlots);
    }


}
