package com.estime.room.application.service;

import com.estime.common.NotFoundException;
import com.estime.room.application.dto.input.ParticipantCreateInput;
import com.estime.room.application.dto.input.RoomCreateInput;
import com.estime.room.application.dto.input.VotesUpdateInput;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput.DateTimeParticipantsOutput;
import com.estime.room.application.dto.output.ParticipantCheckOutput;
import com.estime.room.application.dto.output.RoomCreateOutput;
import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
import com.estime.room.domain.participant.Participant;
import com.estime.room.domain.participant.ParticipantRepository;
import com.estime.room.domain.participant.vote.VoteRepository;
import com.estime.room.domain.participant.vote.Votes;
import com.estime.room.domain.vo.DateTimeSlot;
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
    public RoomOutput getRoomBySession(final String session) {
        final Room room = roomRepository.findBySession(session)
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
    public DateTimeSlotStatisticOutput calculateVoteStatistic(final String session) {
        final Long roomId = roomRepository.findIdBySession(session)
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()));

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

    public Votes getParticipantVotesBySessionAndParticipantName(final String session, final String participantName) {
        final Long roomId = roomRepository.findIdBySession(session)
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()));

        final Long participantId = participantRepository.findIdByRoomIdAndName(roomId, participantName)
                .orElseThrow(() -> new NotFoundException(Participant.class.getSimpleName()));

        return voteRepository.findAllByParticipantId(participantId);
    }

    @Transactional
    public Votes updateParticipantVotes(final VotesUpdateInput input) {
        final Long roomId = roomRepository.findIdBySession(input.roomSession())
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()));

        final Long participantId = participantRepository.findIdByRoomIdAndName(roomId, input.participantName())
                .orElseThrow(() -> new NotFoundException(Participant.class.getSimpleName()));

        final Votes originVotes = voteRepository.findAllByParticipantId(participantId);
        voteRepository.deleteAllInBatch(originVotes);

        return voteRepository.saveAll(Votes.from(input.toEntities(participantId)));
    }

    @Transactional
    public ParticipantCheckOutput saveParticipant(final ParticipantCreateInput input) {
        final Long roomId = roomRepository.findIdBySession(input.roomSession())
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()));

        final boolean isDuplicateName = participantRepository.existsByRoomIdAndName(roomId, input.participantName());

        if (!isDuplicateName) {
            participantRepository.save(input.toEntity(roomId));
        }

        return ParticipantCheckOutput.from(isDuplicateName);
    }
}
