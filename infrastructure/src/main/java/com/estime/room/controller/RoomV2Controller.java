package com.estime.room.controller;

import com.estime.exception.NotFoundException;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.room.participant.vote.compact.CompactVote;
import com.estime.room.participant.vote.compact.CompactVoteRepository;
import com.estime.room.participant.vote.compact.CompactVotes;
import com.estime.room.controller.dto.request.ParticipantVotesUpdateRequestV2;
import com.estime.room.controller.dto.response.ParticipantVotesResponseV2;
import com.estime.room.controller.dto.response.VoteStatisticResponseV2;
import com.estime.shared.CustomApiResponse;
import com.estime.shared.DomainTerm;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequiredArgsConstructor
public class RoomV2Controller implements RoomV2ControllerSpecification {

    private final CompactVoteRepository compactVoteRepository;
    private final ParticipantRepository participantRepository;
    private final RoomRepository roomRepository;

    @Override
    public CustomApiResponse<ParticipantVotesResponseV2> updateVotes(
            @PathVariable("session") RoomSession session,
            @RequestBody ParticipantVotesUpdateRequestV2 request
    ) {
        request.validate();

        Room room = roomRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM));

        ParticipantName participantName = ParticipantName.from(request.participantName());
        Long participantId = participantRepository.findIdByRoomIdAndName(room.getId(), participantName)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PARTICIPANT));

        CompactVotes existingVotes = compactVoteRepository.findAllByParticipantId(participantId);
        if (!existingVotes.isEmpty()) {
            compactVoteRepository.deleteAllInBatch(existingVotes);
        }

        List<CompactDateTimeSlot> compactSlots = request.toCompactSlots();
        Set<CompactVote> newVotes = compactSlots.stream()
                .map(slot -> CompactVote.of(participantId, slot))
                .collect(java.util.stream.Collectors.toSet());

        CompactVotes savedVotes = compactVoteRepository.saveAll(CompactVotes.from(newVotes));

        return CustomApiResponse.ok(
                "투표가 업데이트되었습니다",
                ParticipantVotesResponseV2.from(savedVotes)
        );
    }

    @Override
    public CustomApiResponse<ParticipantVotesResponseV2> getVotes(
            @PathVariable("session") RoomSession session,
            @RequestParam("participantName") String participantName
    ) {
        Room room = roomRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM));

        ParticipantName name = ParticipantName.from(participantName);
        Long participantId = participantRepository.findIdByRoomIdAndName(room.getId(), name)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PARTICIPANT));

        CompactVotes votes = compactVoteRepository.findAllByParticipantId(participantId);

        return CustomApiResponse.ok(ParticipantVotesResponseV2.from(votes));
    }

    @Override
    public CustomApiResponse<VoteStatisticResponseV2> getStatistics(
            @PathVariable("session") RoomSession session
    ) {
        Room room = roomRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM));

        List<Long> participantIds = participantRepository.findIdsByRoomId(room.getId());
        CompactVotes allVotes = compactVoteRepository.findAllByParticipantIds(participantIds);
        Map<CompactDateTimeSlot, Set<Long>> statistic = allVotes.calculateStatistic();

        return CustomApiResponse.ok(
                VoteStatisticResponseV2.from(statistic, participantIds.size())
        );
    }
}
