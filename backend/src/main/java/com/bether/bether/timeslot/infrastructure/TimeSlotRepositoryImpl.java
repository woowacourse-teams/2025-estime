package com.bether.bether.timeslot.infrastructure;

import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class TimeSlotRepositoryImpl implements TimeSlotRepository {

    private final TimeSlotJpaRepository timeSlotJpaRepository;

    @Override
    public List<TimeSlot> findAllByRoomSession(final UUID roomSession) {
        return timeSlotJpaRepository.findAllByRoomSession(roomSession);
    }

    @Override
    public TimeSlot save(final TimeSlot timeSlot) {
        return timeSlotJpaRepository.save(timeSlot);
    }

    @Override
    public List<TimeSlot> saveAll(final List<TimeSlot> timeSlots) {
        return timeSlotJpaRepository.saveAll(timeSlots);
    }
}
