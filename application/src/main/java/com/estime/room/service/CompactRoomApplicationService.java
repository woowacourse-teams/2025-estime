package com.estime.room.service;

import com.estime.cache.CacheNames;
import com.estime.exception.NotFoundException;
import com.estime.port.out.RoomEventSender;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.dto.input.CompactVoteUpdateInput;
import com.estime.room.dto.input.CompactVotesOutput;
import com.estime.room.dto.input.RoomSessionInput;
import com.estime.room.dto.input.VotesFindInput;
import com.estime.room.dto.output.CompactDateTimeSlotStatisticOutput;
import com.estime.room.dto.output.CompactDateTimeSlotStatisticOutput.CompactDateTimeParticipantsOutput;
import com.estime.room.event.VotesUpdatedEvent;
import com.estime.room.exception.UnavailableSlotException;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.participant.Participants;
import com.estime.room.participant.vote.compact.CompactVoteRepository;
import com.estime.room.participant.vote.compact.CompactVotes;
import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.room.slot.RoomAvailableSlot;
import com.estime.shared.DomainTerm;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompactRoomApplicationService {

    private final RoomEventSender roomEventSender;
    private final CompactVoteRepository compactVoteRepository;
    private final ParticipantRepository participantRepository;
    private final RoomRepository roomRepository;

    @Cacheable(value = CacheNames.COMPACT_VOTE_STATISTIC, key = "#input.session()", sync = true)
    @Transactional(readOnly = true)
    public CompactDateTimeSlotStatisticOutput calculateVoteStatistic(final RoomSessionInput input) {
        final Long roomId = obtainRoomIdBySession(input.session());

        final List<Long> participantIds = participantRepository.findIdsByRoomId(roomId);

        final CompactVotes votes = compactVoteRepository.findAllByParticipantIds(participantIds);

        final Map<CompactDateTimeSlot, Set<Long>> dateTimeSlotParticipants = votes.calculateStatistic();

        final Set<Long> participantsIds = dateTimeSlotParticipants.values().stream()
                .flatMap(Collection::stream)
                .collect(Collectors.toSet());

        final Participants participants = participantRepository.findAllByIdIn(participantsIds);

        final Map<Long, ParticipantName> idToName = participants.getIdToName();

        return new CompactDateTimeSlotStatisticOutput(
                participants.getSize(),
                participants.getAllNames(),
                dateTimeSlotParticipants.keySet().stream()
                        .map(dateTimeSlot ->
                                new CompactDateTimeParticipantsOutput(
                                        dateTimeSlot,
                                        dateTimeSlotParticipants.get(dateTimeSlot).stream()
                                                .map(idToName::get)
                                                .toList())
                        ).toList());
    }

    @Transactional(readOnly = true)
    public CompactVotesOutput getParticipantVotesBySessionAndParticipantName(final VotesFindInput input) {
        final Long roomId = obtainRoomIdBySession(input.session());
        final Long participantId = obtainParticipantIdByRoomIdAndName(roomId, input.name());
        final CompactVotes votes = compactVoteRepository.findAllByParticipantId(participantId);
        return CompactVotesOutput.from(input.name(), votes);
    }

    @CacheEvict(value = CacheNames.COMPACT_VOTE_STATISTIC, key = "#input.session()")
    @Transactional
    public CompactVotesOutput updateParticipantVotes(final CompactVoteUpdateInput input) {
        final Room room = obtainRoomWithSlotsBySession(input.session());
        final Long participantId = obtainParticipantIdByRoomIdAndName(room.getId(), input.name());

        room.ensureDeadlineNotPassed(LocalDateTime.now());
        ensureRoomAvailableSlots(room, input.dateTimeSlots());

        final CompactVotes originVotes = compactVoteRepository.findAllByParticipantId(participantId);
        final CompactVotes updatedVotes = CompactVotes.from(input.toEntities(participantId));

        compactVoteRepository.deleteAllInBatch(originVotes.subtract(updatedVotes));
        compactVoteRepository.saveAll(updatedVotes.subtract(originVotes));

        final RoomSession roomSession = room.getSession();
        final String participantName = input.name().getValue();
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                try {
                    roomEventSender.sendEvent(roomSession, new VotesUpdatedEvent(participantName));
                } catch (final Exception e) {
                    log.warn("Failed to send SSE [votes-updated] after commit. roomSession={}", roomSession, e);
                }
            }
        });

        return CompactVotesOutput.from(input.name(), updatedVotes);
    }

    private void ensureRoomAvailableSlots(
            final Room room,
            final List<CompactDateTimeSlot> dateTimeSlots
    ) {
        final Set<CompactDateTimeSlot> availableSlots = room.getRoomAvailableSlots().stream()
                .map(RoomAvailableSlot::getSlotCode)
                .collect(Collectors.toSet());

        for (final CompactDateTimeSlot dateTimeSlot : dateTimeSlots) {
            if (!availableSlots.contains(dateTimeSlot)) {
                throw new UnavailableSlotException(DomainTerm.DATE_TIME_SLOT, room.getSession(), dateTimeSlot);
            }
        }
    }

    private Room obtainRoomWithSlotsBySession(final RoomSession session) {
        return roomRepository.findWithAvailableSlotsBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, session));
    }

    private Long obtainRoomIdBySession(final RoomSession session) {
        return roomRepository.findIdBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, session));
    }

    private Long obtainParticipantIdByRoomIdAndName(final Long roomId, final ParticipantName name) {
        return participantRepository.findIdByRoomIdAndName(roomId, name)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PARTICIPANT, roomId, name));
    }
}
