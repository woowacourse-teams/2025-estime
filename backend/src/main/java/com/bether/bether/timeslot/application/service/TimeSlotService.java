package com.bether.bether.timeslot.application.service;

import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotRecommendationsOutput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotStatisticOutput;
import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlotRepository;
import com.bether.bether.timeslot.domain.TimeSlotStatistic;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    @Transactional(readOnly = true)
    public List<TimeSlot> getAllByRoomId(final Long roomId) {
        return timeSlotRepository.findAllByRoomId(roomId);
    }

    @Transactional(readOnly = true)
    public List<TimeSlot> getAllByRoomIdAndUserName(final Long roomId, final String userName) {
        return timeSlotRepository.findAllByRoomIdAndUserName(roomId, userName);
    }

    @Transactional
    public List<TimeSlot> saveAll(final Long roomId, final TimeSlotInput input) {
        final List<TimeSlot> timeSlots = input.toEntity(roomId);
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

    private TimeSlotStatistic calculateTimeSlotStatistic(final Long roomId) {
        // TODO List<TimeSlot> 일급 컬렉션 적용
        final List<TimeSlot> timeSlots = getAllByRoomId(roomId);
        final TimeSlotStatistic statistic = TimeSlotStatistic.create();
        statistic.calculate(timeSlots);
        return statistic;
    }
}
