package com.bether.bether.timeslot.domain;

import java.util.List;
import java.util.Optional;

public interface TimeSlotRepository {

    Optional<TimeSlot> findById(Long id);

    TimeSlot save(TimeSlot timeSlot);

    List<TimeSlot> saveAll(List<TimeSlot> timeSlots);
}
