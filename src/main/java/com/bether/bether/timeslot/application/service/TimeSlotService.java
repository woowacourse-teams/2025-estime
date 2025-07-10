package com.bether.bether.timeslot.application.service;

import com.bether.bether.common.NotFoundException;
import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;
import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    @Transactional(readOnly = true)
    public TimeSlot getById(final Long id) {
        return timeSlotRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(TimeSlot.class.getSimpleName()));
    }

    @Transactional
    public List<TimeSlot> saveAll(final TimeSlotInput input) {
        final List<TimeSlot> timeSlots = input.toEntity();
        return timeSlotRepository.saveAll(timeSlots);
    }
}
