package com.estime.room.application.service;

import com.estime.common.NotFoundException;
import com.estime.room.application.dto.input.ParticipantCreateInput;
import com.estime.room.application.dto.input.RoomCreateInput;
import com.estime.room.application.dto.input.VotesUpdateInput;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput.DateTimeParticipantsOutput;
import com.estime.room.application.dto.output.ParticipantCheckOutput;
import com.estime.room.application.dto.output.ParticipantCreateOutput;
import com.estime.room.application.dto.output.RoomCreateOutput;
import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
import com.estime.room.domain.participant.Participant;
import com.estime.room.domain.participant.ParticipantRepository;
import com.estime.room.domain.participant.vote.VoteRepository;
import com.estime.room.domain.participant.vote.Votes;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.vo.RoomSession;
import com.github.f4b6a3.tsid.Tsid;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoomApplicationService {

    private final RoomRepository roomRepository;
    private final ParticipantRepository participantRepository;
    private final VoteRepository voteRepository;

    @Transactional(readOnly = true)
    public RoomOutput getRoomBySession(final Tsid session) {
        final RoomSession roomSession = RoomSession.from(session);
        final Room room = roomRepository.findBySession(roomSession)
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()));
        return RoomOutput.from(room);
    }

    @Transactional
    public RoomCreateOutput saveRoom(final RoomCreateInput input) {
        final Room room = input.toEntity();
        final Room saved = roomRepository.save(room);
        return RoomCreateOutput.from(saved);
    }

    @Transactional(readOnly = true)
    public DateTimeSlotStatisticOutput calculateVoteStatistic(final Tsid session) {
        final RoomSession roomSession = RoomSession.from(session);
        final Long roomId = getALong(roomSession);

        final List<Long> participantIds = participantRepository.findIdsByRoomId(roomId);

        final Votes votes = voteRepository.findAllByParticipantIds(participantIds);

        final Map<DateTimeSlot, Set<Long>> dateTimeSlotParticipants = votes.calculateStatistic();

        final Set<Long> participantsIds = dateTimeSlotParticipants.values().stream()
                .flatMap(Collection::stream)
                .collect(Collectors.toSet());

        final Map<Long, String> idToName = participantRepository.findAllByIdIn(participantsIds).stream()
                .collect(Collectors.toMap(Participant::getId, Participant::getName));

        return new DateTimeSlotStatisticOutput(
                participantIds.size(),
                dateTimeSlotParticipants.keySet().stream()
                        .map(dateTimeSlot ->
                                new DateTimeParticipantsOutput(
                                        dateTimeSlot,
                                        dateTimeSlotParticipants.get(dateTimeSlot).stream()
                                                .map(idToName::get)
                                                .toList())
                        ).toList());

    }

    @Transactional(readOnly = true)
    public Votes getParticipantVotesBySessionAndParticipantName(final Tsid session, final String participantName) {
        final RoomSession roomSession = RoomSession.from(session);
        final Long roomId = getALong(roomSession);

        final Long participantId = participantRepository.findIdByRoomIdAndName(roomId, participantName)
                .orElseThrow(() -> new NotFoundException(Participant.class.getSimpleName()));

        return voteRepository.findAllByParticipantId(participantId);
    }

    @Transactional
    public Votes updateParticipantVotes(final VotesUpdateInput input) {
        final Long roomId = getALong(input.roomSession());

        final Long participantId = participantRepository.findIdByRoomIdAndName(roomId, input.participantName())
                .orElseThrow(() -> new NotFoundException(Participant.class.getSimpleName()));

        final Votes originVotes = voteRepository.findAllByParticipantId(participantId);
        voteRepository.deleteAllInBatch(originVotes);

        return voteRepository.saveAll(Votes.from(input.toEntities(participantId)));
    }

    @Transactional
    public ParticipantCreateOutput saveParticipant(final ParticipantCreateInput input) {
        final Long roomId = getALong(input.roomSession());

        final boolean exists = participantRepository.existsByRoomIdAndName(roomId, input.participantName());

        if (exists) {
            throw new IllegalArgumentException(
                    "Participant name already exists: %s".formatted(input.participantName()));
        }

        return ParticipantCreateOutput.from(participantRepository.save(input.toEntity(roomId)));
    }

    public ParticipantCheckOutput checkParticipantExists(final Tsid session, final String participantName) {
        final RoomSession roomSession = RoomSession.from(session);
        final Long roomId = getALong(roomSession);

        return ParticipantCheckOutput.from(
                participantRepository.existsByRoomIdAndName(roomId, participantName));
    }

    private Long getALong(final RoomSession roomSession) {
        return roomRepository.findIdBySession(roomSession)
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()));
    }
}
