package com.bether.bether.timeslot.domain;

import java.util.List;

public interface TimeSlotRepository {

    List<TimeSlot> findAllByRoomId(Long roomId);

    List<TimeSlot> findAllByRoomIdAndUserName(Long roomId, String userName);

    TimeSlot save(TimeSlot timeSlot);

    List<TimeSlot> saveAll(List<TimeSlot> timeSlots);

    void deleteAll(List<TimeSlot> timeSlots);
}
