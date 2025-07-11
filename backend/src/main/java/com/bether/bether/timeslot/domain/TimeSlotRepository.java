package com.bether.bether.timeslot.domain;

import java.util.List;
import java.util.UUID;

public interface TimeSlotRepository {

    TimeSlot save(TimeSlot timeSlot);

    List<TimeSlot> saveAll(List<TimeSlot> timeSlots);

    List<TimeSlot> findAllByRoomSession(UUID roomSession);
}
