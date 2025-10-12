package com.estime.room.infrastructure;

import com.estime.room.application.port.DateSlotRepository;
import com.estime.room.slot.DateSlot;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class DateSlotRepositoryAdapter implements DateSlotRepository {

    private final DateSlotJpaRepository dateSlotJpaRepository;

    @Override
    public List<DateSlot> findByRoomId(final Long roomId) {
        return dateSlotJpaRepository.findByRoomId(roomId);
    }

    @Override
    public DateSlot save(final DateSlot dateSlot) {
        return dateSlotJpaRepository.save(dateSlot);
    }
}
