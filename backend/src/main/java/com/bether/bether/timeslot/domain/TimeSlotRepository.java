package com.bether.bether.timeslot.domain;

import java.util.List;
import java.util.UUID;

public interface TimeSlotRepository {

    List<TimeSlot> findAllByRoomSession(UUID roomSession);

    List<TimeSlot> findAllByRoomSessionAndUserName(UUID roomSession, String userName);

    TimeSlot save(TimeSlot timeSlot);

    List<TimeSlot> saveAll(List<TimeSlot> timeSlots);
}
