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
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoomApplicationService {

    private final RoomDomainService roomDomainService;
    private final TimeSlotService timeSlotService;

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
<<<<<<< HEAD:backend/src/main/java/com/bether/bether/room/application/service/RoomApplicationService.java
    public List<TimeSlot> getTimeSlotsBySession(final UUID session) {
        final Long id = roomDomainService.getIdBySession(session);
=======
    public TimeSlots getTimeSlotsBySession(final UUID session) {
        final Long id = getIdBySession(session);
>>>>>>> origin/be/dev:backend/src/main/java/com/bether/bether/room/application/service/RoomService.java
        return timeSlotService.getAllByRoomId(id);
    }

    @Transactional(readOnly = true)
<<<<<<< HEAD:backend/src/main/java/com/bether/bether/room/application/service/RoomApplicationService.java
    public List<TimeSlot> getTimeSlotsBySessionAndUserName(final UUID session, final String userName) {
        final Long id = roomDomainService.getIdBySession(session);
=======
    public TimeSlots getTimeSlotsBySessionAndUserName(final UUID session, final String userName) {
        final Long id = getIdBySession(session);
>>>>>>> origin/be/dev:backend/src/main/java/com/bether/bether/room/application/service/RoomService.java
        return timeSlotService.getAllByRoomIdAndUserName(id, userName);
    }

    @Transactional
<<<<<<< HEAD:backend/src/main/java/com/bether/bether/room/application/service/RoomApplicationService.java
    public List<TimeSlot> saveTimeSlots(final TimeSlotInput input) {
        final Long id = roomDomainService.getIdBySession(input.roomSession());
=======
    public TimeSlots saveTimeSlots(final TimeSlotInput input) {
        final Long id = getIdBySession(input.roomSession());
>>>>>>> origin/be/dev:backend/src/main/java/com/bether/bether/room/application/service/RoomService.java
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
}
