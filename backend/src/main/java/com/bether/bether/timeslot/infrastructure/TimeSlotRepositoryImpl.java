package com.bether.bether.timeslot.infrastructure;

import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlotRepository;
import com.bether.bether.timeslot.domain.TimeSlots;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TimeSlotRepositoryImpl implements TimeSlotRepository {

    private final TimeSlotJpaRepository timeSlotJpaRepository;

    @Override
    public TimeSlots findAllByRoomId(final Long roomId) {
        return TimeSlots.from(timeSlotJpaRepository.findAllByRoomId(roomId));
    }

    @Override
    public TimeSlots findAllByRoomIdAndUserName(final Long roomId, final String userName) {
        return TimeSlots.from(timeSlotJpaRepository.findAllByRoomIdAndUserName(roomId, userName));
    }

    @Override
    public TimeSlot save(final TimeSlot timeSlot) {
        return timeSlotJpaRepository.save(timeSlot);
    }

    @Override
    public TimeSlots saveAll(final TimeSlots timeSlots) {
        return TimeSlots.from(timeSlotJpaRepository.saveAll(timeSlots.getTimeSlots()));
    }

    @Override
    public void deleteAllInBatch(final TimeSlots timeSlots) {
        timeSlotJpaRepository.deleteAllInBatch(timeSlots.getTimeSlots());
    }
}
