package com.estime.estime.datetimeslot.application.service;

import com.estime.estime.datetimeslot.application.dto.input.DateTimeSlotInput;
import com.estime.estime.datetimeslot.application.dto.input.DateTimeSlotUpdateInput;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotRecommendationsOutput;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.estime.datetimeslot.domain.DateTimeSlotRepository;
import com.estime.estime.datetimeslot.domain.DateTimeSlotStatistic;
import com.estime.estime.datetimeslot.domain.DateTimeSlots;
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
    public DateTimeSlotStatisticOutput generateDateTimeSlotStatistic(final Long roomId) {
        final DateTimeSlotStatistic statistic = getAllByRoomId(roomId).calculateStatistic();
        return DateTimeSlotStatisticOutput.from(statistic.getStatistic());
    }

    @Transactional(readOnly = true)
    public DateTimeSlotRecommendationsOutput recommendTopDateTimeSlots(final Long roomId) {
        final DateTimeSlotStatistic statistic = getAllByRoomId(roomId).calculateStatistic();
        return DateTimeSlotRecommendationsOutput.from(statistic.getRecommendation());
    }

    @Transactional
    public DateTimeSlots updateDateTimeSlots(final Long roomId, final DateTimeSlotUpdateInput input) {
        final DateTimeSlots existing = dateTimeSlotRepository.findAllByRoomIdAndUserName(roomId, input.userName());
        final Set<LocalDateTime> existingStartAts = existing.calculateUniqueStartAts();
        final Set<LocalDateTime> requestedStartAts = Set.copyOf(input.dateTimes());

        // TODO DB 조회 로직 최적화 필요
        if (existingStartAts.equals(requestedStartAts)) {
            return getAllByRoomIdAndUserName(roomId, input.userName());
        }

        final DateTimeSlots dateTimeSlotsToSave = existing.findSlotsToSave(requestedStartAts, roomId, input.userName());
        final DateTimeSlots dateTimeSlotsToDelete = existing.findSlotsToDelete(requestedStartAts);

        if (dateTimeSlotsToSave.isNotEmpty()) {
            dateTimeSlotRepository.saveAll(dateTimeSlotsToSave);
        }
        if (dateTimeSlotsToDelete.isNotEmpty()) {
            dateTimeSlotRepository.deleteAllInBatch(dateTimeSlotsToDelete);
        }

        return getAllByRoomIdAndUserName(roomId, input.userName());
    }
}
