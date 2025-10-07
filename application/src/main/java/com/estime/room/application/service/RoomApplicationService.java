package com.estime.room.application.service;

import com.estime.shared.DomainTerm;
import com.estime.exception.NotFoundException;
import com.estime.common.sse.application.SseService;
import com.estime.room.application.dto.input.ConnectedRoomCreateInput;
import com.estime.room.application.dto.input.ParticipantCreateInput;
import com.estime.room.application.dto.input.RoomCreateInput;
import com.estime.room.application.dto.input.RoomSessionInput;
import com.estime.room.application.dto.input.VotesFindInput;
import com.estime.room.application.dto.input.VotesOutput;
import com.estime.room.application.dto.input.VotesUpdateInput;
import com.estime.room.application.dto.output.ConnectedRoomCreateOutput;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput.DateTimeParticipantsOutput;
import com.estime.room.application.dto.output.ParticipantCheckOutput;
import com.estime.room.application.dto.output.RoomCreateOutput;
import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.participant.Participants;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.vote.VoteRepository;
import com.estime.room.participant.vote.Votes;
import com.estime.room.platform.Platform;
import com.estime.room.platform.PlatformNotificationType;
import com.estime.room.platform.PlatformRepository;
import com.estime.room.slot.DateTimeSlot;
import com.estime.room.RoomSession;
import com.estime.room.platform.discord.DiscordMessageSender;
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
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomApplicationService {

    private final SseService sseService;
    private final RoomRepository roomRepository;
    private final ParticipantRepository participantRepository;
    private final VoteRepository voteRepository;
    private final PlatformRepository platformRepository;
    private final DiscordMessageSender discordMessageSender; // TODO EVENT

    @Transactional
    public RoomCreateOutput createRoom(final RoomCreateInput input) {
        return RoomCreateOutput.from(roomRepository.save(input.toEntity()));
    }

    @Transactional
    public ConnectedRoomCreateOutput createConnectedRoom(final ConnectedRoomCreateInput input) {
        final RoomCreateInput roomCreateInput = input.toRoomCreateInput();
        final Room room = roomRepository.save(roomCreateInput.toEntity());

        final Platform platform = platformRepository.save(
                Platform.withoutId(
                        room.getId(),
                        input.type(),
                        input.channelId(),
                        input.notification()));

        if (platform.getNotification().shouldNotifyFor(PlatformNotificationType.CREATED)) {
            discordMessageSender.sendConnectedRoomCreatedMessage(
                    input.channelId(),
                    room.getSession(),
                    room.getTitle(),
                    room.getDeadline());
        }

        return ConnectedRoomCreateOutput.from(room.getSession(), platform.getType());
    }

    @Transactional(readOnly = true)
    public RoomOutput getRoomBySession(final RoomSessionInput input) {
        final Room room = obtainRoomBySession(input.session());
        return RoomOutput.from(room);
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

        // TODO: participantRepository 에서 Participants를 return 하도록 변경 논의 필요
        final Participants participants = Participants.from(participantRepository.findAllByIdIn(participantsIds));

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

    @Transactional
    public VotesOutput updateParticipantVotes(final VotesUpdateInput input) {
        final Room room = obtainRoomBySession(input.session());
        final Long participantId = obtainParticipantIdByRoomIdAndName(room.getId(), input.name());

        room.ensureDeadlineNotPassed(LocalDateTime.now());
        room.ensureAvailableDateTimeSlots(input.dateTimeSlots());

        final Votes originVotes = voteRepository.findAllByParticipantId(participantId);
        final Votes updatedVotes = Votes.from(input.toEntities(participantId));

        voteRepository.deleteAllInBatch(originVotes.subtract(updatedVotes));
        voteRepository.saveAll(updatedVotes.subtract(originVotes));

        final RoomSession roomSession = room.getSession();
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                try {
                    sseService.sendMessageByRoomSession(roomSession, "vote-changed");
                } catch (final Exception e) {
                    log.warn("Failed to send SSE [vote-changed] after commit. roomSession={}", roomSession, e);
                }
            }
        });

        return VotesOutput.from(input.name(), updatedVotes);
    }

    @Transactional
    public ParticipantCheckOutput createParticipant(final ParticipantCreateInput input) {
        final Room room = obtainRoomBySession(input.session());
        final Long roomId = room.getId();

        room.ensureDeadlineNotPassed(LocalDateTime.now());

        final boolean isDuplicateName = participantRepository.existsByRoomIdAndName(roomId, input.name());
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

    private Long obtainParticipantIdByRoomIdAndName(final Long roomId, final ParticipantName name) {
        return participantRepository.findIdByRoomIdAndName(roomId, name)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PARTICIPANT, roomId, name));
    }
}
