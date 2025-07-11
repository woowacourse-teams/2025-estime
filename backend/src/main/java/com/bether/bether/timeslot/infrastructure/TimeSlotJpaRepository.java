package com.bether.bether.timeslot.infrastructure;

import com.bether.bether.timeslot.domain.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TimeSlotJpaRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findAllByRoomSession(UUID roomSession);

    List<TimeSlot> findAllByRoomSessionAndUserName(UUID roomSession, String userName);
}
