package com.estime.room.controller;

import com.estime.room.RoomSession;
import com.estime.room.controller.dto.request.ConnectedRoomCreateRequestV3;
import com.estime.room.controller.dto.request.ParticipantVotesUpdateRequestV3;
import com.estime.room.controller.dto.request.RoomCreateRequestV3;
import com.estime.room.controller.dto.response.ConnectedRoomCreateResponse;
import com.estime.room.controller.dto.response.DateTimeSlotStatisticResponseV3;
import com.estime.room.controller.dto.response.ParticipantVotesResponseV3;
import com.estime.room.controller.dto.response.RoomCreateResponse;
import com.estime.room.controller.dto.response.RoomResponseV3;
import com.estime.room.dto.input.RoomSessionInput;
import com.estime.room.dto.input.VotesFindInput;
import com.estime.room.dto.input.VotesOutput;
import com.estime.room.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.dto.output.RoomOutput;
import com.estime.room.service.RoomApplicationService;
import com.estime.shared.CustomApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RoomV3Controller implements RoomV3ControllerSpecification {

    private final RoomApplicationService roomApplicationService;

    @Override
    public CustomApiResponse<RoomCreateResponse> createRoom(@RequestBody final RoomCreateRequestV3 request) {
        return CustomApiResponse.ok(
                RoomCreateResponse.from(
                        roomApplicationService.createRoom(request.toInput())));
    }

    @Override
    public CustomApiResponse<ConnectedRoomCreateResponse> createConnectedRoom(
            @RequestBody final ConnectedRoomCreateRequestV3 request) {
        return CustomApiResponse.ok(
                ConnectedRoomCreateResponse.from(
                        roomApplicationService.createConnectedRoom(request.toInput())));
    }

    @Override
    public CustomApiResponse<RoomResponseV3> getBySession(
            @PathVariable("session") final RoomSession session
    ) {
        final RoomOutput output = roomApplicationService.getRoomBySession(RoomSessionInput.from(session));
        return CustomApiResponse.ok(RoomResponseV3.from(output));
    }

    @Override
    public CustomApiResponse<DateTimeSlotStatisticResponseV3> getDateTimeSlotStatisticBySession(
            @PathVariable("session") final RoomSession session
    ) {
        final DateTimeSlotStatisticOutput output = roomApplicationService.calculateVoteStatistic(
                RoomSessionInput.from(session));
        return CustomApiResponse.ok(DateTimeSlotStatisticResponseV3.from(output));
    }

    @Override
    public CustomApiResponse<ParticipantVotesResponseV3> getParticipantVotesBySessionAndParticipantName(
            @PathVariable("session") final RoomSession session,
            @RequestParam("participantName") final String participantName
    ) {
        final VotesOutput output = roomApplicationService.getParticipantVotesBySessionAndParticipantName(
                VotesFindInput.of(session, participantName));
        return CustomApiResponse.ok(ParticipantVotesResponseV3.from(output));
    }

    @Override
    public CustomApiResponse<ParticipantVotesResponseV3> updateParticipantVotes(
            @PathVariable("session") final RoomSession session,
            @RequestBody final ParticipantVotesUpdateRequestV3 request
    ) {
        final VotesOutput output = roomApplicationService.updateParticipantVotes(
                request.toInput(session));
        return CustomApiResponse.ok(
                "Update success",
                ParticipantVotesResponseV3.from(output)
        );
    }
}
