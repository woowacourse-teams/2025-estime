package com.bether.bether.timeslot.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TimeSlotParticipants {

    private final LocalDateTime dateTime;
    private final List<String> userNames;

    public static TimeSlotParticipants from(final LocalDateTime dateTime) {
        return new TimeSlotParticipants(dateTime, new ArrayList<>());
    }

    public void addUserName(final String userName) {
        userNames.add(userName);
    }

    public int size() {
        return userNames.size();
    }
}
