package com.estime.room.service;

import com.estime.cache.CacheNames;
import com.estime.exception.NotFoundException;
import com.estime.port.out.PlatformMessageSender;
import com.estime.port.out.RoomMessageSender;
import com.estime.port.out.RoomSessionGenerator;
import com.estime.port.out.TimeProvider;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.SlotBatchRepository;
import com.estime.room.dto.input.ConnectedRoomCreateInput;
import com.estime.room.dto.input.DateSlotInput;
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
import com.estime.room.exception.PastNotAllowedException;
import com.estime.room.exception.UnavailableSlotException;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.participant.Participants;
import com.estime.room.participant.vote.VoteRepository;
import com.estime.room.participant.vote.Votes;
import com.estime.room.platform.Platform;
import com.estime.room.platform.PlatformRepository;
import com.estime.room.platform.notification.PlatformNotificationOutbox;
import com.estime.room.platform.notification.PlatformNotificationOutboxRepository;
import com.estime.room.platform.notification.PlatformNotificationType;
import com.estime.room.slot.AvailableDateSlot;
import com.estime.room.slot.AvailableDateSlotRepository;
import com.estime.room.slot.AvailableTimeSlot;
import com.estime.room.slot.AvailableTimeSlotRepository;
import com.estime.room.slot.DateTimeSlot;
import com.estime.shared.DomainTerm;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
public class RoomApplicationService {

    private final RoomMessageSender roomMessageSender;
    private final RoomRepository roomRepository;
    private final ParticipantRepository participantRepository;
    private final VoteRepository voteRepository;
    private final PlatformRepository platformRepository;
    private final PlatformMessageSender platformMessageSender;
    private final SlotBatchRepository slotBatchRepository;
    private final AvailableDateSlotRepository availableDateSlotRepository;
    private final AvailableTimeSlotRepository availableTimeSlotRepository;
    private final RoomSessionGenerator roomSessionGenerator;
    private final PlatformNotificationOutboxRepository platformNotificationOutboxRepository;
    private final TimeProvider timeProvider;

    @Transactional
    public RoomCreateOutput createRoom(final RoomCreateInput input) {
        final RoomSession session = roomSessionGenerator.generate();
        final Room room = Room.withoutId(input.title(), session, input.deadline());
        final Room savedRoom = roomRepository.save(room);

        validateAvailableDateSlots(input.availableDateSlots());

        final List<AvailableDateSlot> availableDateSlots = input.availableDateSlots().stream()
                .map(slot -> AvailableDateSlot.of(savedRoom.getId(), slot.startAt()))
                .toList();
        final List<AvailableTimeSlot> availableTimeSlots = input.availableTimeSlots().stream()
                .map(slot -> AvailableTimeSlot.of(savedRoom.getId(), slot.startAt()))
                .toList();

        slotBatchRepository.batchInsertSlots(
                availableDateSlots,
                availableTimeSlots
        );
        return RoomCreateOutput.from(savedRoom);
    }

    private void validateAvailableDateSlots(final List<DateSlotInput> availableDateSlots) {
        for (final DateSlotInput availableDateSlot : availableDateSlots) {
            if (availableDateSlot.startAt().isBefore(LocalDate.now())) {
                throw new PastNotAllowedException(DomainTerm.DATE_SLOT, availableDateSlot.startAt());
            }
        }
    }

    @Transactional
    public ConnectedRoomCreateOutput createConnectedRoom(final ConnectedRoomCreateInput input) {
        final RoomCreateInput roomCreateInput = input.toRoomCreateInput();
        final RoomSession session = roomSessionGenerator.generate();
        final Room room = Room.withoutId(roomCreateInput.title(), session, roomCreateInput.deadline());
        final Room savedRoom = roomRepository.save(room);

        validateAvailableDateSlots(input.availableDateSlots());

        final List<AvailableDateSlot> availableDateSlots = input.availableDateSlots().stream()
                .map(slot -> AvailableDateSlot.of(savedRoom.getId(), slot.startAt()))
                .toList();
        final List<AvailableTimeSlot> availableTimeSlots = input.availableTimeSlots().stream()
                .map(slot -> AvailableTimeSlot.of(savedRoom.getId(), slot.startAt()))
                .toList();

        slotBatchRepository.batchInsertSlots(
                availableDateSlots,
                availableTimeSlots
        );

        final Platform platform = platformRepository.save(
                Platform.withoutId(
                        savedRoom.getId(),
                        input.platformType(),
                        input.channelId(),
                        input.notification()));

        for (final PlatformNotificationType type : PlatformNotificationType.values()) {
            if (platform.getNotification().shouldNotifyFor(type)) {
                platformNotificationOutboxRepository.save(
                        PlatformNotificationOutbox.of(
                                savedRoom.getId(),
                                input.platformType(),
                                platform.getChannelId(),
                                type,
                                savedRoom.getCreatedAt(),
                                savedRoom.getDeadline(timeProvider.zone())));
            }
        }

        return ConnectedRoomCreateOutput.from(savedRoom.getSession(), platform.getType());
    }

    @Transactional(readOnly = true)
    public RoomOutput getRoomBySession(final RoomSessionInput input) {
        final Room room = obtainRoomBySession(input.session());
        final List<AvailableDateSlot> availableDateSlots = availableDateSlotRepository.findByRoomId(room.getId());
        final List<AvailableTimeSlot> availableTimeSlots = availableTimeSlotRepository.findByRoomId(room.getId());
        return RoomOutput.of(room, availableDateSlots, availableTimeSlots);
    }

    @Cacheable(value = CacheNames.VOTE_STATISTIC, key = "#input.session()", sync = true)
    @Transactional(readOnly = true)
    public DateTimeSlotStatisticOutput calculateVoteStatistic(final RoomSessionInput input) {
        final Long roomId = obtainRoomIdBySession(input.session());

        final List<Long> participantIds = participantRepository.findIdsByRoomId(roomId);

        final Votes votes = voteRepository.findAllByParticipantIds(participantIds);

        final Map<DateTimeSlot, Set<Long>> dateTimeSlotParticipants = votes.calculateStatistic();

        final Set<Long> participantsIds = dateTimeSlotParticipants.values().stream()
                .flatMap(Collection::stream)
                .collect(Collectors.toSet());

        final Participants participants = participantRepository.findAllByIdIn(participantsIds);

        final Map<Long, ParticipantName> idToName = participants.getIdToName();

        return new DateTimeSlotStatisticOutput(
                participants.getSize(),
                participants.getAllNames(),
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
    public VotesOutput getParticipantVotesBySessionAndParticipantName(final VotesFindInput input) {
        final Long roomId = obtainRoomIdBySession(input.session());
        final Long participantId = obtainParticipantIdByRoomIdAndName(roomId, input.name());
        final Votes votes = voteRepository.findAllByParticipantId(participantId);
        return VotesOutput.from(input.name(), votes);
    }

    @CacheEvict(value = CacheNames.VOTE_STATISTIC, key = "#input.session()")
    @Transactional
    public VotesOutput updateParticipantVotes(final VotesUpdateInput input) {
        final Room room = obtainRoomBySession(input.session());
        final Long participantId = obtainParticipantIdByRoomIdAndName(room.getId(), input.name());

        room.ensureDeadlineNotPassed(LocalDateTime.now());
        ensureAvailableDateTimeSlots(room.getId(), room.getSession(), input.dateTimeSlots());

        final Votes originVotes = voteRepository.findAllByParticipantId(participantId);
        final Votes updatedVotes = Votes.from(input.toEntities(participantId));

        voteRepository.deleteAllInBatch(originVotes.subtract(updatedVotes));
        voteRepository.saveAll(updatedVotes.subtract(originVotes));

        final RoomSession roomSession = room.getSession();
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                try {
                    roomMessageSender.sendMessage(roomSession, "vote-changed");
                } catch (final Exception e) {
                    log.warn("Failed to send SSE [vote-changed] after commit. roomSession={}", roomSession, e);
                }
            }
        });

        return VotesOutput.from(input.name(), updatedVotes);
    }

    private void ensureAvailableDateTimeSlots(final Long roomId, final RoomSession session,
                                              final List<DateTimeSlot> dateTimeSlots) {
        final Set<LocalDate> availableDates = availableDateSlotRepository.findByRoomId(roomId).stream()
                .map(AvailableDateSlot::getStartAt)
                .collect(Collectors.toSet());
        final Set<LocalTime> availableTimes = availableTimeSlotRepository.findByRoomId(roomId).stream()
                .map(AvailableTimeSlot::getStartAt)
                .collect(Collectors.toSet());

        for (final DateTimeSlot dateTimeSlot : dateTimeSlots) {
            if (!availableDates.contains(dateTimeSlot.getStartAt().toLocalDate()) ||
                    !availableTimes.contains(dateTimeSlot.getStartAt().toLocalTime())) {
                throw new UnavailableSlotException(DomainTerm.DATE_TIME_SLOT, session, dateTimeSlot);
            }
        }
    }

    @Transactional
    public ParticipantCheckOutput createParticipant(final ParticipantCreateInput input) {
        final Room room = obtainRoomBySession(input.session());
        final Long roomId = room.getId();

        room.ensureDeadlineNotPassed(LocalDateTime.now());

        final int affected = participantRepository.saveIfNotExists(input.toEntity(roomId));
        final boolean isDuplicateName = affected == 0;
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

    private Long obtainParticipantIdByRoomIdAndName(final Long roomId, final ParticipantName name) {
        return participantRepository.findIdByRoomIdAndName(roomId, name)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PARTICIPANT, roomId, name));
    }
}
