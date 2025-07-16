package com.bether.bether.timeslot.domain;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class TimeSlotStatistic {

    private final Map<LocalDateTime, TimeSlotParticipants> participantsByDateTime;

    public static TimeSlotStatistic create() {
        return new TimeSlotStatistic(new HashMap<>());
    }

    public void calculate(final List<TimeSlot> timeSlots) {
        for (final TimeSlot timeSlot : timeSlots) {
            accumulate(timeSlot);
        }
    }

    public List<TimeSlotParticipants> getStatistic() {
        return participantsByDateTime.values()
                .stream()
                .toList();
    }

    public List<TimeSlotParticipants> getRank() {
        return participantsByDateTime.values()
                .stream()
                .sorted(Comparator.comparingInt(TimeSlotParticipants::size).reversed())
                .toList().subList(0, 2); // TODO 매직 넘버 관리 여부 논의 필요
    }

    private void accumulate(final TimeSlot timeSlot) {
        final LocalDateTime dateTime = timeSlot.getStartAt();

        participantsByDateTime.putIfAbsent(dateTime, TimeSlotParticipants.from(dateTime));
        participantsByDateTime.computeIfPresent(dateTime, ((dateTimeKey, timeSlotParticipants) -> {
            timeSlotParticipants.addUserName(timeSlot.getUserName());
            return timeSlotParticipants;
        }));
    }
}
