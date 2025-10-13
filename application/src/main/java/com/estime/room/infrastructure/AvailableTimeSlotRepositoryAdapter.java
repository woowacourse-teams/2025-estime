package com.estime.room.infrastructure;

import com.estime.room.slot.AvailableTimeSlot;
import com.estime.room.slot.AvailableTimeSlotRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AvailableTimeSlotRepositoryAdapter implements AvailableTimeSlotRepository {

    private final AvailableTimeSlotJpaRepository availableTimeSlotJpaRepository;

    @Override
    public List<AvailableTimeSlot> findByRoomId(final Long roomId) {
        return availableTimeSlotJpaRepository.findByRoomId(roomId);
    }

    @Override
    public AvailableTimeSlot save(final AvailableTimeSlot availableTimeSlot) {
        return availableTimeSlotJpaRepository.save(availableTimeSlot);
    }
}
