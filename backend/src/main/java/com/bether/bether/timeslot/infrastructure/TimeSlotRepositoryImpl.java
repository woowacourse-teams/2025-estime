package com.bether.bether.timeslot.infrastructure;

import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlotRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TimeSlotRepositoryImpl implements TimeSlotRepository {

    private final TimeSlotJpaRepository timeSlotJpaRepository;

    @Override
    public List<TimeSlot> findAllByRoomId(Long roomId) {
        return timeSlotJpaRepository.findAllByRoomId(roomId);
    }

    @Override
    public List<TimeSlot> findAllByRoomIdAndUserName(Long roomId, String userName) {
        return timeSlotJpaRepository.findAllByRoomIdAndUserName(roomId, userName);
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
