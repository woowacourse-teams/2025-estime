package com.estime.room.service;

import com.estime.cache.CacheNames;
import com.estime.exception.NotFoundException;
import com.estime.port.out.RoomSessionGenerator;
import com.estime.port.out.TimeProvider;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.dto.input.ConnectedRoomCreateInput;
import com.estime.room.dto.input.ParticipantCreateInput;
import com.estime.room.dto.input.RoomCreateInput;
import com.estime.room.dto.input.RoomSessionInput;
import com.estime.room.dto.input.VotesFindInput;
import com.estime.room.dto.input.VotesOutput;
import com.estime.room.dto.input.VotesUpdateInput;
import com.estime.room.dto.output.ConnectedRoomCreateOutput;
import com.estime.room.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.dto.output.DateTimeSlotStatisticOutput.DateTimeParticipantsOutput;
import com.estime.room.dto.output.ParticipantCheckOutput;
import com.estime.room.dto.output.RoomCreateOutput;
import com.estime.room.dto.output.RoomOutput;
import com.estime.room.event.VotesUpdatedEvent;
import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.participant.Participants;
import com.estime.room.participant.vote.VoteRepository;
import com.estime.room.participant.vote.Votes;
import com.estime.room.platform.Platform;
import com.estime.room.platform.PlatformRepository;
import com.estime.room.platform.notification.PlatformNotificationOutboxRepository;
import com.estime.shared.DomainTerm;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomApplicationService {

    private final ApplicationEventPublisher eventPublisher;
    private final RoomRepository roomRepository;
    private final ParticipantRepository participantRepository;
    private final VoteRepository voteRepository;
    private final PlatformRepository platformRepository;
    private final RoomSessionGenerator roomSessionGenerator;
    private final PlatformNotificationOutboxRepository platformNotificationOutboxRepository;
    private final TimeProvider timeProvider;

    @Transactional
    public RoomCreateOutput createRoom(final RoomCreateInput input) {
        final Room room = roomRepository.save(
                Room.withoutId(
                        input.title(),
                        roomSessionGenerator.generate(),
                        input.deadline(),
                        input.slots(),
                        timeProvider.now()));

        return RoomCreateOutput.from(room);
    }

    @Transactional
    public ConnectedRoomCreateOutput createConnectedRoom(final ConnectedRoomCreateInput input) {
        final Room room = roomRepository.save(
                Room.withoutId(
                        input.title(),
                        roomSessionGenerator.generate(),
                        input.deadline(),
                        input.slots(),
                        timeProvider.now()));

        final Platform platform = platformRepository.save(
                Platform.withoutId(
                        room.getId(),
                        input.platformType(),
                        input.channelId(),
                        input.notification()));

        platform.createNotificationOutboxes(room.getCreatedAt(), room.getDeadline(), timeProvider.now())
                .forEach(platformNotificationOutboxRepository::save);

        return ConnectedRoomCreateOutput.from(room.getSession(), platform.getType());
    }

    @Transactional(readOnly = true)
    public RoomOutput getRoomBySession(final RoomSessionInput input) {
        final Room room = obtainRoomWithAvailableSlotsBySession(input.session());
        return RoomOutput.from(room);
    }

    @Cacheable(value = CacheNames.VOTE_STATISTIC, key = "#input.session()", sync = true)
    @Transactional(readOnly = true)
    public DateTimeSlotStatisticOutput calculateVoteStatistic(final RoomSessionInput input) {
        final Long roomId = obtainRoomIdBySession(input.session());

        final List<Long> participantIds = participantRepository.findIdsByRoomId(roomId);

        final Votes votes = voteRepository.findAllByParticipantIds(participantIds);

        final Votes.Statistic statistic = votes.calculateStatistic();

        final Participants participants = participantRepository.findAllByIdIn(statistic.allParticipantIds());

        final Map<Long, ParticipantName> idToName = participants.getIdToName();

        return new DateTimeSlotStatisticOutput(
                participants.getSize(),
                participants.getAllNames(),
                statistic.dateTimeSlots().stream()
                        .map(dateTimeSlot ->
                                new DateTimeParticipantsOutput(
                                        dateTimeSlot,
                                        statistic.participantIdsFor(dateTimeSlot).stream()
                                                .map(idToName::get)
                                                .toList())
                        ).toList());
    }

    @Transactional(readOnly = true)
    public VotesOutput getParticipantVotesBySessionAndParticipantName(final VotesFindInput input) {
        final Long roomId = obtainRoomIdBySession(input.session());
        final Long participantId = obtainParticipantIdByRoomIdAndName(roomId, input.name());
        final Votes votes = voteRepository.findAllByParticipantId(participantId);
        return VotesOutput.from(input.name(), votes);
    }

    @CacheEvict(value = CacheNames.VOTE_STATISTIC, key = "#input.session()")
    @Retryable(
            retryFor = {OptimisticLockingFailureException.class, DataIntegrityViolationException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 50)
    )
    @Transactional
    public VotesOutput updateParticipantVotes(final VotesUpdateInput input) {
        final Room room = obtainRoomWithAvailableSlotsBySession(input.session());
        final Participant participant = obtainParticipantByRoomIdAndName(room.getId(), input.name());

        room.ensureDeadlineNotPassed(timeProvider.now());
        room.ensureAvailableSlots(input.dateTimeSlots());

        participant.markVoted(timeProvider.now());

        final Long participantId = participant.getId();
        final Votes originVotes = voteRepository.findAllByParticipantId(participantId);
        final Votes updatedVotes = Votes.from(input.toEntities(participantId));

        final Votes.Diff diff = originVotes.diff(updatedVotes);
        voteRepository.deleteAllInBatch(diff.toRemove());
        voteRepository.saveAll(diff.toAdd());

        eventPublisher.publishEvent(
                new VotesUpdatedEvent(room.getSession(), input.name().getValue())
        );

        return VotesOutput.from(input.name(), updatedVotes);
    }

    @Transactional
    public ParticipantCheckOutput createParticipant(final ParticipantCreateInput input) {
        final Room room = obtainRoomBySession(input.session());
        final Long roomId = room.getId();

        room.ensureDeadlineNotPassed(timeProvider.now());

        final int affected = participantRepository.saveIfNotExists(input.toEntity(roomId));
        final boolean isDuplicateName = affected == 0;
        return ParticipantCheckOutput.from(isDuplicateName);
    }

    private Room obtainRoomBySession(final RoomSession session) {
        return roomRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, session));
    }

    private Room obtainRoomWithAvailableSlotsBySession(final RoomSession session) {
        return roomRepository.findWithAvailableSlotsBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, session));
    }

    private Long obtainRoomIdBySession(final RoomSession session) {
        return roomRepository.findIdBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, session));
    }

    private Participant obtainParticipantByRoomIdAndName(final Long roomId, final ParticipantName name) {
        return participantRepository.findByRoomIdAndName(roomId, name)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PARTICIPANT, roomId, name));
    }

    private Long obtainParticipantIdByRoomIdAndName(final Long roomId, final ParticipantName name) {
        return participantRepository.findIdByRoomIdAndName(roomId, name)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PARTICIPANT, roomId, name));
    }
}
