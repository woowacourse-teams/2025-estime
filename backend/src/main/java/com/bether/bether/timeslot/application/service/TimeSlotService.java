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
        return TimeSlotStatisticOutput.from(calculateTimeSlotStatistic(roomId).getStatistic());
    }

    @Transactional(readOnly = true)
    public TimeSlotRecommendationsOutput recommendTopTimeSlots(final Long roomId) {
        return TimeSlotRecommendationsOutput.from(calculateTimeSlotStatistic(roomId).getRecommendation());
    }

    @Transactional
    public void updateTimeSlots(final Long roomId, final TimeSlotUpdateInput input) {
        final List<TimeSlot> existingTimeSlots = timeSlotRepository.findAllByRoomIdAndUserName(roomId,
                input.userName()).getTimeSlots(); //FIXME : 임시

        final Set<LocalDateTime> existingStartAts = existingTimeSlots.stream()
                .map(TimeSlot::getStartAt)
                .collect(Collectors.toSet());

        final Set<LocalDateTime> requestedStartAts = Set.copyOf(input.dateTimes());

        if (existingStartAts.equals(requestedStartAts)) {
            return;
        }

        final List<TimeSlot> timeSlotsToSave = requestedStartAts.stream()
                .filter(startAt -> !existingStartAts.contains(startAt))
                .map(startAt -> TimeSlot.withoutId(roomId, input.userName(), startAt))
                .toList();

        final List<TimeSlot> timeSlotsToDelete = existingTimeSlots.stream()
                .filter(timeSlot -> !requestedStartAts.contains(timeSlot.getStartAt()))
                .toList();

        if (!timeSlotsToSave.isEmpty()) {
            timeSlotRepository.saveAll(TimeSlots.from(timeSlotsToSave));
        }
        if (!timeSlotsToDelete.isEmpty()) {
            timeSlotRepository.deleteAll(TimeSlots.from(timeSlotsToDelete));
        }
    }

    private TimeSlotStatistic calculateTimeSlotStatistic(final Long roomId) {
        // TODO List<TimeSlot> 일급 컬렉션 적용
        final List<TimeSlot> timeSlots = getAllByRoomId(roomId).getTimeSlots(); // FIXME : 임시
        final TimeSlotStatistic statistic = TimeSlotStatistic.create();
        statistic.calculate(timeSlots);
        return statistic;
    }
}
