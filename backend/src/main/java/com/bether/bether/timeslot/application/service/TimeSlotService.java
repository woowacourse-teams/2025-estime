package com.bether.bether.timeslot.application.service;

import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;
import com.bether.bether.timeslot.application.dto.input.TimeSlotUpdateInput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotRecommendationsOutput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotStatisticOutput;
import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlotRepository;
import com.bether.bether.timeslot.domain.TimeSlotStatistic;
import com.bether.bether.timeslot.domain.TimeSlots;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    @Transactional(readOnly = true)
    public TimeSlots getAllByRoomId(final Long roomId) {
        return timeSlotRepository.findAllByRoomId(roomId);
    }

    @Transactional(readOnly = true)
    public TimeSlots getAllByRoomIdAndUserName(final Long roomId, final String userName) {
        return timeSlotRepository.findAllByRoomIdAndUserName(roomId, userName);
    }

    @Transactional
    public TimeSlots saveAll(final Long roomId, final TimeSlotInput input) {
        final TimeSlots timeSlots = input.toEntity(roomId);
        return timeSlotRepository.saveAll(timeSlots);
    }

    @Transactional(readOnly = true)
    public TimeSlotStatisticOutput generateTimeSlotStatistic(final Long roomId) {
        final TimeSlotStatistic statistic = getAllByRoomId(roomId).calculateStatistic();
        return TimeSlotStatisticOutput.from(statistic.getStatistic());
    }

    @Transactional(readOnly = true)
    public TimeSlotRecommendationsOutput recommendTopTimeSlots(final Long roomId) {
        final TimeSlotStatistic statistic = getAllByRoomId(roomId).calculateStatistic();
        return TimeSlotRecommendationsOutput.from(statistic.getRecommendation());
    }

    @Transactional
    public void updateTimeSlots(final Long roomId, final TimeSlotUpdateInput input) {
        final TimeSlots existing = timeSlotRepository.findAllByRoomIdAndUserName(roomId, input.userName());
        final Set<LocalDateTime> existingStartAts = existing.calculateUniqueStartAts();
        final Set<LocalDateTime> requestedStartAts = Set.copyOf(input.dateTimes());

        if (existingStartAts.equals(requestedStartAts)) {
            return;
        }

        final TimeSlots timeSlotsToSave = existing.findSlotsToSave(requestedStartAts, roomId, input.userName());
        final TimeSlots timeSlotsToDelete = existing.findSlotsToDelete(requestedStartAts);

        if (timeSlotsToSave.isNotEmpty()) {
            timeSlotRepository.saveAll(timeSlotsToSave);
        }
        if (timeSlotsToDelete.isNotEmpty()) {
            timeSlotRepository.deleteAll(timeSlotsToDelete);
        }
    }
}
