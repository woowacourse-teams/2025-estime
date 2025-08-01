package com.estime.room.application.service;

import com.estime.common.NotFoundException;
import com.estime.room.application.dto.input.ParticipantCreateInput;
import com.estime.room.application.dto.input.RoomCreateInput;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.application.dto.output.ParticipantCreateOutput;
import com.estime.room.application.dto.output.RoomCreateOutput;
import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
import com.estime.room.domain.participant.ParticipantDomainService;
import com.estime.room.domain.participant.ParticipantRepository;
import com.estime.room.domain.participant.slot.DateTimeSlotParticipants;
import com.estime.room.domain.participant.slot.ParticipantDateTimeSlotDomainService;
import com.estime.room.domain.participant.slot.ParticipantDateTimeSlotRepository;
import com.estime.room.domain.participant.slot.ParticipantDateTimeSlots;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoomApplicationService {

    private final ParticipantDateTimeSlotDomainService participantDateTimeSlotDomainService;
    private final ParticipantDomainService participantDomainService;
    private final RoomRepository roomRepository;
    private final ParticipantRepository participantRepository;
    private final ParticipantDateTimeSlotRepository participantDateTimeSlotRepository;

    @Transactional
    public RoomCreateOutput saveRoom(final RoomCreateInput input) {
        final Room room = input.toEntity();
        final Room saved = roomRepository.save(room);
        return RoomCreateOutput.from(saved);
    }

    @Transactional(readOnly = true)
    public RoomOutput getBySession(final String session) {
        final Room room = roomRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()));
        return RoomOutput.from(room);
    }

    @Transactional(readOnly = true)
    public DateTimeSlotStatisticOutput generateDateTimeSlotStatistic(final String session) {
        final Long roomId = roomRepository.findIdBySession(session)
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()));

        final List<Long> participantIds = participantRepository.findIdsByRoomId(roomId);

        final ParticipantDateTimeSlots slots = participantDateTimeSlotRepository.findAllByParticipantIds(
                participantIds);

        final Collection<DateTimeSlotParticipants> dateTimeSlotParticipants = slots.calculateStatistic();

        final Set<Long> participantsIds = dateTimeSlotParticipants.stream()
                .map(DateTimeSlotParticipants::getParticipantIds)
                .flatMap(Collection::stream)
                .collect(Collectors.toSet());

        participantRepository.findByIds(participantsIds);


    }

    @Transactional
    public ParticipantDateTimeSlots saveDateTimeSlots(final DateTimeSlotInput input) {
        final Long id = roomDomainService.getIdBySession(input.roomSession());
        return participantDateTimeSlotDomainService.saveAll(id, input);
    }

    @Transactional(readOnly = true)
    public DateTimeSlotRecommendations recommendTopDateTimeSlots(final String session) {
        final Long id = roomDomainService.getIdBySession(session);
        return participantDateTimeSlotDomainService.recommendTopDateTimeSlots(id);
    }

    @Transactional
    public ParticipantDateTimeSlots updateTimeSlots(final DateTimeSlotUpdateInput input) {
        final Long roomId = roomDomainService.getIdBySession(input.roomSession());
        return participantDateTimeSlotDomainService.updateDateTimeSlots(roomId, input);
    }

    @Transactional
    public ParticipantCreateOutput saveUser(final String session, final ParticipantCreateInput input) {
        final Long id = roomDomainService.getIdBySession(session);
        return ParticipantCreateOutput.from(participantDomainService.getByRoomIdAndName(id, input));
    }
}
