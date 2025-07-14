package com.bether.bether.timeslot.application.service;

import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;
import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    @Transactional(readOnly = true)
    public List<TimeSlot> getAllByRoomSession(final UUID roomSession) {
        return timeSlotRepository.findAllByRoomSession(roomSession);
    }

    @Transactional(readOnly = true)
    public List<TimeSlot> getAllByRoomSessionAndUserName(final UUID roomSession, final String userName) {
        return timeSlotRepository.findAllByRoomSessionAndUserName(roomSession, userName);
    }

    @Transactional
    public List<TimeSlot> saveAll(final TimeSlotInput input) {
        final List<TimeSlot> timeSlots = input.toEntity();
        return timeSlotRepository.saveAll(timeSlots);
    }
}
