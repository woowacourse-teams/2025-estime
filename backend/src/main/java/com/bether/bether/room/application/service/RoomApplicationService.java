package com.bether.bether.room.application.service;

import com.bether.bether.room.application.dto.RoomCreateInput;
import com.bether.bether.room.application.dto.RoomCreateOutput;
import com.bether.bether.room.application.dto.RoomOutput;
import com.bether.bether.room.domain.Room;
import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;
import com.bether.bether.timeslot.application.dto.input.TimeSlotUpdateInput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotRecommendationsOutput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotStatisticOutput;
import com.bether.bether.timeslot.application.service.TimeSlotService;
import com.bether.bether.timeslot.domain.TimeSlots;
import com.bether.bether.user.application.dto.input.UserCreateInput;
import com.bether.bether.user.application.dto.output.UserCreateOutput;
import com.bether.bether.user.application.service.UserDomainService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoomApplicationService {

    private final RoomDomainService roomDomainService;
    private final TimeSlotService timeSlotService;
    private final UserDomainService userDomainService;

    @Transactional(readOnly = true)
    public RoomOutput getBySession(final UUID session) {
        final Room room = roomDomainService.getBySession(session);
        return RoomOutput.from(room);
    }

    @Transactional
    public RoomCreateOutput saveRoom(final RoomCreateInput input) {
        final Room room = input.toEntity();
        final Room saved = roomDomainService.save(room);
        return RoomCreateOutput.from(saved);
    }

    @Transactional(readOnly = true)
    public TimeSlots getTimeSlotsBySession(final UUID session) {
        final Long id = roomDomainService.getIdBySession(session);
        return timeSlotService.getAllByRoomId(id);
    }

    @Transactional(readOnly = true)
    public TimeSlots getTimeSlotsBySessionAndUserName(final UUID session, final String userName) {
        final Long id = roomDomainService.getIdBySession(session);
        return timeSlotService.getAllByRoomIdAndUserName(id, userName);
    }

    @Transactional
    public TimeSlots saveTimeSlots(final TimeSlotInput input) {
        final Long id = roomDomainService.getIdBySession(input.roomSession());
        return timeSlotService.saveAll(id, input);
    }

    @Transactional(readOnly = true)
    public TimeSlotStatisticOutput generateTimeSlotStatistic(final UUID session) {
        final Long id = roomDomainService.getIdBySession(session);
        return timeSlotService.generateTimeSlotStatistic(id);
    }

    @Transactional(readOnly = true)
    public TimeSlotRecommendationsOutput recommendTopTimeSlots(final UUID session) {
        final Long id = roomDomainService.getIdBySession(session);
        return timeSlotService.recommendTopTimeSlots(id);
    }

    @Transactional
    public void updateTimeSlots(final TimeSlotUpdateInput input) {
        final Long roomId = roomDomainService.getIdBySession(input.roomSession());
        timeSlotService.updateTimeSlots(roomId, input);
    }

    @Transactional
    public UserCreateOutput saveUser(final UUID session, final UserCreateInput input) {
        final Long id = roomDomainService.getIdBySession(session);
        return UserCreateOutput.from(userDomainService.getByRoomIdAndName(id, input));
    }
}
