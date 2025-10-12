package com.estime.room.infrastructure;

import com.estime.room.slot.TimeSlot;
import com.estime.room.slot.TimeSlotRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TimeSlotRepositoryAdapter implements TimeSlotRepository {

    private final TimeSlotJpaRepository timeSlotJpaRepository;

    @Override
    public List<TimeSlot> findByRoomId(final Long roomId) {
        return timeSlotJpaRepository.findByRoomId(roomId);
    }

    @Override
    public TimeSlot save(final TimeSlot timeSlot) {
        return timeSlotJpaRepository.save(timeSlot);
    }
}
