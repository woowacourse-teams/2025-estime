package com.estime.estime.datetimeslot.infrastructure;

import com.estime.estime.datetimeslot.domain.DateTimeSlot;
import com.estime.estime.datetimeslot.domain.DateTimeSlotRepository;
import com.estime.estime.datetimeslot.domain.DateTimeSlots;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class DateTimeSlotRepositoryImpl implements DateTimeSlotRepository {

    private final DateTimeSlotJpaRepository dateTimeSlotJpaRepository;

    @Override
    public DateTimeSlots findAllByRoomId(final Long roomId) {
        return DateTimeSlots.from(dateTimeSlotJpaRepository.findAllByRoomId(roomId));
    }

    @Override
    public DateTimeSlots findAllByRoomIdAndUserName(final Long roomId, final String userName) {
        return DateTimeSlots.from(dateTimeSlotJpaRepository.findAllByRoomIdAndUserName(roomId, userName));
    }

    @Override
    public DateTimeSlot save(final DateTimeSlot dateTimeSlot) {
        return dateTimeSlotJpaRepository.save(dateTimeSlot);
    }

    @Override
    public DateTimeSlots saveAll(final DateTimeSlots dateTimeSlots) {
        return DateTimeSlots.from(dateTimeSlotJpaRepository.saveAll(dateTimeSlots.getDateTimeSlots()));
    }

    @Override
    public void deleteAllInBatch(final DateTimeSlots dateTimeSlots) {
        dateTimeSlotJpaRepository.deleteAllInBatch(dateTimeSlots.getDateTimeSlots());
    }
}
