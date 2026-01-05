package com.estime.room.controller;

import com.estime.room.RoomSession;
import com.estime.room.controller.dto.request.ParticipantVotesUpdateRequestV2;
import com.estime.room.controller.dto.response.ParticipantVotesResponseV2;
import com.estime.room.controller.dto.response.VoteStatisticResponseV2;
import com.estime.room.dto.input.CompactVotesOutput;
import com.estime.room.dto.input.RoomSessionInput;
import com.estime.room.dto.input.VotesFindInput;
import com.estime.room.dto.output.CompactDateTimeSlotStatisticOutput;
import com.estime.room.service.CompactRoomApplicationService;
import com.estime.shared.CustomApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RoomV2Controller implements RoomV2ControllerSpecification {

    private final CompactRoomApplicationService compactRoomApplicationService;

    @Override
    public CustomApiResponse<VoteStatisticResponseV2> getDateTimeSlotStatisticBySession(
            @PathVariable("session") final RoomSession session
    ) {
        final CompactDateTimeSlotStatisticOutput output = compactRoomApplicationService.calculateVoteStatistic(
                RoomSessionInput.from(session));
        return CustomApiResponse.ok(VoteStatisticResponseV2.from(output));
    }

    @Override
    public CustomApiResponse<ParticipantVotesResponseV2> updateParticipantVotes(
            @PathVariable("session") final RoomSession session,
            @RequestBody final ParticipantVotesUpdateRequestV2 request
    ) {
        final CompactVotesOutput output = compactRoomApplicationService.updateParticipantVotes(
                request.toInput(session));
        return CustomApiResponse.ok(
                "Update success",
                ParticipantVotesResponseV2.from(output)
        );
    }

    @Override
    public CustomApiResponse<ParticipantVotesResponseV2> getParticipantVotesBySessionAndParticipantName(
            @PathVariable("session") final RoomSession session,
            @RequestParam("participantName") final String participantName
    ) {
        final CompactVotesOutput output = compactRoomApplicationService.getParticipantVotesBySessionAndParticipantName(
                VotesFindInput.of(session, participantName));
        return CustomApiResponse.ok(ParticipantVotesResponseV2.from(output));
    }
}
