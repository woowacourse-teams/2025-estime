package com.estime.room.infrastructure;

import com.estime.room.slot.AvailableDateSlot;
import com.estime.room.slot.AvailableDateSlotRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AvailableDateSlotRepositoryAdapter implements AvailableDateSlotRepository {

    private final AvailableDateSlotJpaRepository availableDateSlotJpaRepository;

    @Override
    public List<AvailableDateSlot> findByRoomId(final Long roomId) {
        return availableDateSlotJpaRepository.findByRoomId(roomId);
    }

    @Override
    public AvailableDateSlot save(final AvailableDateSlot availableDateSlot) {
        return availableDateSlotJpaRepository.save(availableDateSlot);
    }
}
