package com.bether.bether.room.application.service;

import com.bether.bether.common.NotFoundException;
import com.bether.bether.room.application.dto.RoomCreatedInput;
import com.bether.bether.room.application.dto.RoomCreatedOutput;
import com.bether.bether.room.application.dto.RoomOutput;
import com.bether.bether.room.domain.Room;
import com.bether.bether.room.domain.RoomRepository;
import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;
import com.bether.bether.timeslot.application.dto.input.TimeSlotUpdateInput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotRecommendationsOutput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotStatisticOutput;
import com.bether.bether.timeslot.application.service.TimeSlotService;
import com.bether.bether.timeslot.domain.TimeSlot;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final TimeSlotService timeSlotService;

    @Transactional(readOnly = true)
    public RoomOutput getBySession(final UUID session) {
        final Room room = roomRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()));
        return RoomOutput.from(room);
    }

    @Transactional
    public RoomCreatedOutput saveRoom(final RoomCreatedInput input) {
        final Room room = input.toEntity();
        final Room saved = roomRepository.save(room);
        return RoomCreatedOutput.from(saved);
    }

    @Transactional(readOnly = true)
    public List<TimeSlot> getTimeSlotsBySession(final UUID session) {
        final Long id = getIdBySession(session);
        return timeSlotService.getAllByRoomId(id);
    }

    @Transactional(readOnly = true)
    public List<TimeSlot> getTimeSlotsBySessionAndUserName(final UUID session, final String userName) {
        final Long id = getIdBySession(session);
        return timeSlotService.getAllByRoomIdAndUserName(id, userName);
    }

    @Transactional
    public List<TimeSlot> saveTimeSlots(final TimeSlotInput input) {
        final Long id = getIdBySession(input.roomSession());
        return timeSlotService.saveAll(id, input);
    }

    @Transactional(readOnly = true)
    public TimeSlotStatisticOutput generateTimeSlotStatistic(final UUID session) {
        final Long id = getIdBySession(session);
        return timeSlotService.generateTimeSlotStatistic(id);
    }

    @Transactional(readOnly = true)
    public TimeSlotRecommendationsOutput recommendTopTimeSlots(final UUID session) {
        final Long id = getIdBySession(session);
        return timeSlotService.recommendTopTimeSlots(id);
    }

    @Transactional
    public void updateTimeSlots(final TimeSlotUpdateInput input) {
        final Long roomId = getIdBySession(input.roomSession());
        timeSlotService.updateTimeSlots(roomId, input);
    }

    private Long getIdBySession(final UUID session) {
        return roomRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()))  // TODO 검색 대상 파라미터 명시 여부 논의 필요
                .getId();
    }
}
