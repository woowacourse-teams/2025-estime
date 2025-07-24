package com.bether.bether.datetimeslot.application.service;

import com.bether.bether.datetimeslot.application.dto.input.DateTimeSlotInput;
import com.bether.bether.datetimeslot.application.dto.input.DateTimeSlotUpdateInput;
import com.bether.bether.datetimeslot.application.dto.output.DateTimeSlotRecommendationsOutput;
import com.bether.bether.datetimeslot.application.dto.output.DateTimeSlotStatisticOutput;
import com.bether.bether.datetimeslot.domain.DateTimeSlotRepository;
import com.bether.bether.datetimeslot.domain.DateTimeSlotStatistic;
import com.bether.bether.datetimeslot.domain.DateTimeSlots;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DateTimeSlotService {

    private final DateTimeSlotRepository dateTimeSlotRepository;

    @Transactional(readOnly = true)
    public DateTimeSlots getAllByRoomId(final Long roomId) {
        return dateTimeSlotRepository.findAllByRoomId(roomId);
    }

    @Transactional(readOnly = true)
    public DateTimeSlots getAllByRoomIdAndUserName(final Long roomId, final String userName) {
        return dateTimeSlotRepository.findAllByRoomIdAndUserName(roomId, userName);
    }

    @Transactional
    public DateTimeSlots saveAll(final Long roomId, final DateTimeSlotInput input) {
        final DateTimeSlots dateTimeSlots = input.toEntity(roomId);
        return dateTimeSlotRepository.saveAll(dateTimeSlots);
    }

    @Transactional(readOnly = true)
    public DateTimeSlotStatisticOutput generateTimeSlotStatistic(final Long roomId) {
        final DateTimeSlotStatistic statistic = getAllByRoomId(roomId).calculateStatistic();
        return DateTimeSlotStatisticOutput.from(statistic.getStatistic());
    }

    @Transactional(readOnly = true)
    public DateTimeSlotRecommendationsOutput recommendTopTimeSlots(final Long roomId) {
        final DateTimeSlotStatistic statistic = getAllByRoomId(roomId).calculateStatistic();
        return DateTimeSlotRecommendationsOutput.from(statistic.getRecommendation());
    }

    @Transactional
    public void updateTimeSlots(final Long roomId, final DateTimeSlotUpdateInput input) {
        final DateTimeSlots existing = dateTimeSlotRepository.findAllByRoomIdAndUserName(roomId, input.userName());
        final Set<LocalDateTime> existingStartAts = existing.calculateUniqueStartAts();
        final Set<LocalDateTime> requestedStartAts = Set.copyOf(input.dateTimes());

        if (existingStartAts.equals(requestedStartAts)) {
            return;
        }

        final DateTimeSlots dateTimeSlotsToSave = existing.findSlotsToSave(requestedStartAts, roomId, input.userName());
        final DateTimeSlots dateTimeSlotsToDelete = existing.findSlotsToDelete(requestedStartAts);

        if (dateTimeSlotsToSave.isNotEmpty()) {
            dateTimeSlotRepository.saveAll(dateTimeSlotsToSave);
        }
        if (dateTimeSlotsToDelete.isNotEmpty()) {
            dateTimeSlotRepository.deleteAllInBatch(dateTimeSlotsToDelete);
        }
    }
}
