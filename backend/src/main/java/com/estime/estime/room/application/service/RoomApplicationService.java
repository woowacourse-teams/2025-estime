package com.estime.estime.room.application.service;

import com.estime.estime.datetimeslot.application.dto.input.DateTimeSlotInput;
import com.estime.estime.datetimeslot.application.dto.input.DateTimeSlotUpdateInput;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotRecommendationsOutput;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.estime.datetimeslot.application.service.DateTimeSlotService;
import com.estime.estime.datetimeslot.domain.DateTimeSlots;
import com.estime.estime.room.application.dto.RoomCreateInput;
import com.estime.estime.room.application.dto.RoomCreateOutput;
import com.estime.estime.room.application.dto.RoomOutput;
import com.estime.estime.room.domain.Room;
import com.estime.estime.user.application.dto.input.UserCreateInput;
import com.estime.estime.user.application.dto.output.UserCreateOutput;
import com.estime.estime.user.application.service.UserDomainService;
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
    public RoomOutput getBySession(final String session) {
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
    public DateTimeSlots getDateTimeSlotsBySession(final String session) {
        final Long id = roomDomainService.getIdBySession(session);
        return dateTimeSlotService.getAllByRoomId(id);
    }

    @Transactional(readOnly = true)
    public DateTimeSlots getDateTimeSlotsBySessionAndUserName(final String session, final String userName) {
        final Long id = roomDomainService.getIdBySession(session);
        return dateTimeSlotService.getAllByRoomIdAndUserName(id, userName);
    }

    @Transactional
    public DateTimeSlots saveDateTimeSlots(final DateTimeSlotInput input) {
        final Long id = roomDomainService.getIdBySession(input.roomSession());
        return dateTimeSlotService.saveAll(id, input);
    }

    @Transactional(readOnly = true)
    public DateTimeSlotStatisticOutput generateDateTimeSlotStatistic(final String session) {
        final Long id = roomDomainService.getIdBySession(session);
        return dateTimeSlotService.generateDateTimeSlotStatistic(id);
    }

    @Transactional(readOnly = true)
    public DateTimeSlotRecommendationsOutput recommendTopDateTimeSlots(final String session) {
        final Long id = roomDomainService.getIdBySession(session);
        return dateTimeSlotService.recommendTopDateTimeSlots(id);
    }

    @Transactional
    public DateTimeSlots updateTimeSlots(final DateTimeSlotUpdateInput input) {
        final Long roomId = roomDomainService.getIdBySession(input.roomSession());
        return dateTimeSlotService.updateDateTimeSlots(roomId, input);
    }

    @Transactional
    public UserCreateOutput saveUser(final String session, final UserCreateInput input) {
        final Long id = roomDomainService.getIdBySession(session);
        return UserCreateOutput.from(userDomainService.getByRoomIdAndName(id, input));
    }
}
