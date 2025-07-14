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

    public TimeSlotCount(LocalDateTime dateTime) {
        this.dateTime = dateTime;
        this.count = 0;
        this.userNames = new ArrayList<>();
    }

    public void addUserName(final String userName) {
        userNames.add(userName);
        count++;
    }
}
