package com.bether.bether.timeslot.infrastructure;

import com.bether.bether.timeslot.domain.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotJpaRepository extends JpaRepository<TimeSlot, Long> {

}
