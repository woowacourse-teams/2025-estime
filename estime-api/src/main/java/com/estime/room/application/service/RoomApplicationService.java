package com.estime.room.application.service;

import com.estime.common.DomainTerm;
import com.estime.common.exception.application.NotFoundException;
import com.estime.common.sse.application.SseService;
import com.estime.room.application.dto.input.ConnectedRoomCreateInput;
import com.estime.room.application.dto.input.ParticipantCreateInput;
import com.estime.room.application.dto.input.RoomCreateInput;
import com.estime.room.application.dto.input.VotesUpdateInput;
import com.estime.room.application.dto.output.ConnectedRoomCreateOutput;
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
import com.estime.room.domain.platform.Platform;
import com.estime.room.domain.platform.PlatformRepository;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.vo.RoomSession;
import com.estime.room.infrastructure.platform.PlatformShortcutBuilder;
import com.estime.room.infrastructure.platform.discord.DiscordMessageSender;
import com.github.f4b6a3.tsid.Tsid;
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
    private final PlatformRepository platformRepository;
    private final DiscordMessageSender discordMessageSender; // TODO EVENT
    private final PlatformShortcutBuilder platformShortcutBuilder; // TODO EVENT

    @Transactional
    public RoomCreateOutput createRoom(final RoomCreateInput input) {
        return RoomCreateOutput.from(
                roomRepository.save(
                        input.toEntity()));
    }

    @Transactional
    public ConnectedRoomCreateOutput createConnectedRoom(final ConnectedRoomCreateInput input) {
        final Room room = roomRepository.save(
                input.toRoomCreateInput().toEntity());

        final Platform platform = platformRepository.save(
                Platform.withoutId(
                        room.getId(),
                        input.type(),
                        input.channelId()));

        discordMessageSender.sendConnectedRoomCreatedMessage(
                input.channelId(),
                platformShortcutBuilder.buildConnectedRoomCreatedUrl(room.getSession()),
                room.getTitle(),
                room.getDeadline());

        return ConnectedRoomCreateOutput.from(room.getSession(), platform.getPlatformType());
    }

    @Transactional(readOnly = true)
    public RoomOutput getRoomBySession(final Tsid roomSession) {
        final Room room = getRoomByRoomSession(roomSession);
        return RoomOutput.from(room);
    }

    @Transactional(readOnly = true)
    public DateTimeSlotStatisticOutput calculateVoteStatistic(final Tsid roomSession) {
        final Long roomId = getRoomIdBySession(RoomSession.from(roomSession));

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
    public Votes getParticipantVotesBySessionAndParticipantName(final Tsid roomSession, final String participantName) {
        final Long roomId = getRoomIdBySession(RoomSession.from(roomSession));
        final Long participantId = getParticipantIdByRoomIdAndName(roomId, participantName);
        return voteRepository.findAllByParticipantId(participantId);
    }

    @Transactional
    public Votes updateParticipantVotes(final VotesUpdateInput input) {
        final Room room = roomRepository.findBySession(input.session())
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, input.session()));
        final Long roomId = room.getId();
        final Long participantId = getParticipantIdByRoomIdAndName(roomId, input.participantName());

        room.ensureDeadlineNotPassed(LocalDateTime.now());
        room.ensureAvailableDateTimeSlots(input.dateTimeSlots());

        final Votes originVotes = voteRepository.findAllByParticipantId(participantId);
        final Votes updatedVotes = Votes.from(input.toEntities(participantId));

        voteRepository.deleteAllInBatch(originVotes.subtract(updatedVotes));
        voteRepository.saveAll(updatedVotes.subtract(originVotes));

        try {
            sseService.sendSseByRoomSession(input.session().getValue(), "vote-changed");
        } catch (Exception ignored) {
            log.warn("투표 갱신 이후 sse 전송 실패: {}", input.session().getValue().toString());
        }

        return updatedVotes;
    }

    @Transactional
    public ParticipantCheckOutput createParticipant(final ParticipantCreateInput input) {
        final Room room = roomRepository.findBySession(input.session())
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, input.session()));
        final Long roomId = room.getId();
        room.ensureDeadlineNotPassed(LocalDateTime.now());

        final boolean isDuplicateName = participantRepository.existsByRoomIdAndName(roomId, input.participantName());
        if (!isDuplicateName) {
            participantRepository.save(input.toEntity(roomId));
        }

        return ParticipantCheckOutput.from(isDuplicateName);
    }

    private Room getRoomByRoomSession(final Tsid roomSession) {
        return roomRepository.findBySession(RoomSession.from(roomSession))
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, roomSession));
    }

    private Long getRoomIdBySession(final RoomSession session) {
        return roomRepository.findIdBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, session));
    }

    private Long getParticipantIdByRoomIdAndName(final Long roomId, final String participantName) {
        return participantRepository.findIdByRoomIdAndName(roomId, participantName)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, roomId, participantName));
    }
}
