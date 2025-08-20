package com.estime.room.application.service;

import com.estime.common.DomainTerm;
import com.estime.common.exception.application.NotFoundException;
import com.estime.common.sse.application.SseService;
import com.estime.room.application.dto.input.ParticipantCreateInput;
import com.estime.room.application.dto.input.ParticipantVotesOutput;
import com.estime.room.application.dto.input.RoomCreateInput;
import com.estime.room.application.dto.input.RoomSessionInput;
import com.estime.room.application.dto.input.VotesFindInput;
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
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.vo.RoomSession;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomApplicationService {

    private final SseService sseService;
    private final RoomRepository roomRepository;
    private final ParticipantRepository participantRepository;
    private final VoteRepository voteRepository;

    @Transactional(readOnly = true)
    public RoomOutput getRoomBySession(final RoomSessionInput input) {
        final Room room = obtainRoomBySession(input.session());
        return RoomOutput.from(room);
    }

    @Transactional
    public RoomCreateOutput saveRoom(final RoomCreateInput input) {
        final Room room = input.toEntity();
        final Room saved = roomRepository.save(room);
        return RoomCreateOutput.from(saved);
    }

    @Transactional(readOnly = true)
    public DateTimeSlotStatisticOutput calculateVoteStatistic(final RoomSessionInput input) {
        final Long roomId = obtainRoomIdBySession(input.session());

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
    public ParticipantVotesOutput getParticipantVotesBySessionAndParticipantName(final VotesFindInput input) {
        final Long roomId = obtainRoomIdBySession(input.session());
        final Long participantId = obtainParticipantIdByRoomIdAndName(roomId, input.participantName());
        final Votes votes = voteRepository.findAllByParticipantId(participantId);
        return ParticipantVotesOutput.from(input.participantName(), votes);
    }

    @Transactional
    public ParticipantVotesOutput updateParticipantVotes(final VotesUpdateInput input) {
        final Room room = obtainRoomBySession(input.session());
        final Long participantId = obtainParticipantIdByRoomIdAndName(room.getId(), input.participantName());

        room.ensureDeadlineNotPassed(LocalDateTime.now());
        room.ensureAvailableDateTimeSlots(input.dateTimeSlots());

        final Votes originVotes = voteRepository.findAllByParticipantId(participantId);
        final Votes updatedVotes = Votes.from(input.toEntities(participantId));

        voteRepository.deleteAllInBatch(originVotes.subtract(updatedVotes));
        voteRepository.saveAll(updatedVotes.subtract(originVotes));

        try {
            sseService.sendSseByRoomSession(input.session().getRoomSession(), "vote-changed");
        } catch (Exception ignored) {
            log.warn("투표 갱신 이후 sse 전송 실패: {}", input.session().getRoomSession().toString());
        }

        return ParticipantVotesOutput.from(input.participantName(), updatedVotes);
    }

    @Transactional
    public ParticipantCheckOutput saveParticipant(final ParticipantCreateInput input) {
        final Room room = obtainRoomBySession(input.session());
        final Long roomId = room.getId();

        room.ensureDeadlineNotPassed(LocalDateTime.now());

        final boolean isDuplicateName = participantRepository.existsByRoomIdAndName(roomId, input.participantName());
        if (!isDuplicateName) {
            participantRepository.save(input.toEntity(roomId));
        }

        return ParticipantCheckOutput.from(isDuplicateName);
    }

    private Room obtainRoomBySession(final RoomSession session) {
        return roomRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, session));
    }

    private Long obtainRoomIdBySession(final RoomSession session) {
        return roomRepository.findIdBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, session));
    }

    private Long obtainParticipantIdByRoomIdAndName(final Long roomId, final String participantName) {
        return participantRepository.findIdByRoomIdAndName(roomId, participantName)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PARTICIPANT, roomId, participantName));
    }
}
