package com.bether.bether.timeslot.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TimeSlotRepository {

    TimeSlot save(TimeSlot timeSlot);

    List<TimeSlot> saveAll(List<TimeSlot> timeSlots);

    Optional<TimeSlot> findById(Long id);

    List<TimeSlot> findAllByRoomSession(UUID roomSession);
}
