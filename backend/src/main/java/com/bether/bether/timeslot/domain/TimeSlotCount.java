package com.bether.bether.timeslot.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;

@Getter
public class TimeSlotCount {

    private final LocalDateTime dateTime;
    private Integer count;
    private final List<String> userNames;

    private TimeSlotCount(final LocalDateTime dateTime, final Integer count, final List<String> userNames) {
        this.dateTime = dateTime;
        this.count = count;
        this.userNames = userNames;
    }

    public static TimeSlotCount from(final LocalDateTime dateTime) {
        return new TimeSlotCount(dateTime, 0, new ArrayList<>());
    }

    public void addUserName(final String userName) {
        userNames.add(userName);
        count++;
    }
}
