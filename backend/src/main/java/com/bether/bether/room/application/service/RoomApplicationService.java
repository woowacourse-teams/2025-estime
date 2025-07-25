package com.bether.bether.room.application.service;

import com.bether.bether.datetimeslot.application.dto.input.DateTimeSlotInput;
import com.bether.bether.datetimeslot.application.dto.input.DateTimeSlotUpdateInput;
import com.bether.bether.datetimeslot.application.dto.output.DateTimeSlotRecommendationsOutput;
import com.bether.bether.datetimeslot.application.dto.output.DateTimeSlotStatisticOutput;
import com.bether.bether.datetimeslot.application.service.DateTimeSlotService;
import com.bether.bether.datetimeslot.domain.DateTimeSlots;
import com.bether.bether.room.application.dto.RoomCreateInput;
import com.bether.bether.room.application.dto.RoomCreateOutput;
import com.bether.bether.room.application.dto.RoomOutput;
import com.bether.bether.room.domain.Room;
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
    private final DateTimeSlotService dateTimeSlotService;
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
    public DateTimeSlots getTimeSlotsBySession(final UUID session) {
        final Long id = roomDomainService.getIdBySession(session);
        return dateTimeSlotService.getAllByRoomId(id);
    }

    @Transactional(readOnly = true)
    public DateTimeSlots getTimeSlotsBySessionAndUserName(final UUID session, final String userName) {
        final Long id = roomDomainService.getIdBySession(session);
        return dateTimeSlotService.getAllByRoomIdAndUserName(id, userName);
    }

    @Transactional
    public DateTimeSlots saveTimeSlots(final DateTimeSlotInput input) {
        final Long id = roomDomainService.getIdBySession(input.roomSession());
        return dateTimeSlotService.saveAll(id, input);
    }

    @Transactional(readOnly = true)
    public DateTimeSlotStatisticOutput generateTimeSlotStatistic(final UUID session) {
        final Long id = roomDomainService.getIdBySession(session);
        return dateTimeSlotService.generateTimeSlotStatistic(id);
    }

    @Transactional(readOnly = true)
    public DateTimeSlotRecommendationsOutput recommendTopTimeSlots(final UUID session) {
        final Long id = roomDomainService.getIdBySession(session);
        return dateTimeSlotService.recommendTopTimeSlots(id);
    }

    @Transactional
    public DateTimeSlots updateTimeSlots(final DateTimeSlotUpdateInput input) {
        final Long roomId = roomDomainService.getIdBySession(input.roomSession());
        return dateTimeSlotService.updateTimeSlots(roomId, input);
    }

    @Transactional
    public UserCreateOutput saveUser(final UUID session, final UserCreateInput input) {
        final Long id = roomDomainService.getIdBySession(session);
        return UserCreateOutput.from(userDomainService.getByRoomIdAndName(id, input));
    }
}
