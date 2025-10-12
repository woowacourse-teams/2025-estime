package com.estime.room.controller;

import com.estime.common.CustomApiResponse;
import com.estime.room.dto.input.RoomSessionInput;
import com.estime.room.dto.input.VotesFindInput;
import com.estime.room.dto.input.VotesOutput;
import com.estime.room.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.dto.output.ParticipantCheckOutput;
import com.estime.room.dto.output.RoomOutput;
import com.estime.room.service.RoomApplicationService;
import com.estime.room.controller.dto.request.ConnectedRoomCreateRequest;
import com.estime.room.controller.dto.request.ParticipantCreateRequest;
import com.estime.room.controller.dto.request.ParticipantVotesUpdateRequest;
import com.estime.room.controller.dto.request.RoomCreateRequest;
import com.estime.room.controller.dto.response.ConnectedRoomCreateResponse;
import com.estime.room.controller.dto.response.DateTimeSlotStatisticResponse;
import com.estime.room.controller.dto.response.ParticipantCheckResponse;
import com.estime.room.controller.dto.response.ParticipantVotesResponse;
import com.estime.room.controller.dto.response.ParticipantVotesUpdateResponse;
import com.estime.room.controller.dto.response.RoomCreateResponse;
import com.estime.room.controller.dto.response.RoomResponse;
import com.github.f4b6a3.tsid.Tsid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RoomController implements RoomControllerSpecification {

    private final RoomApplicationService roomApplicationService;

    @Override
    public CustomApiResponse<RoomCreateResponse> createRoom(@RequestBody final RoomCreateRequest request) {
        return CustomApiResponse.ok(
                RoomCreateResponse.from(
                        roomApplicationService.createRoom(request.toInput())));
    }

    @Override
    public CustomApiResponse<ConnectedRoomCreateResponse> createConnectedRoom(
            @RequestBody final ConnectedRoomCreateRequest request) {
        return CustomApiResponse.ok(
                ConnectedRoomCreateResponse.from(
                        roomApplicationService.createConnectedRoom(request.toInput())));
    }

    @Override
    public CustomApiResponse<RoomResponse> getBySession(
            @PathVariable("session") final Tsid roomSession
    ) {
        final RoomOutput output = roomApplicationService.getRoomBySession(RoomSessionInput.from(roomSession));
        return CustomApiResponse.ok(RoomResponse.from(output));
    }

    @Override
    public CustomApiResponse<DateTimeSlotStatisticResponse> getDateTimeSlotStatisticBySession(
            @PathVariable("session") final Tsid roomSession
    ) {
        final DateTimeSlotStatisticOutput output = roomApplicationService.calculateVoteStatistic(
                RoomSessionInput.from(roomSession));
        return CustomApiResponse.ok(DateTimeSlotStatisticResponse.from(output));
    }

    @Override
    public CustomApiResponse<ParticipantVotesResponse> getParticipantVotesBySessionAndParticipantName(
            @PathVariable("session") final Tsid roomSession,
            @RequestParam("participantName") final String participantName
    ) {
        final VotesOutput output = roomApplicationService.getParticipantVotesBySessionAndParticipantName(
                VotesFindInput.of(roomSession, participantName));
        return CustomApiResponse.ok(ParticipantVotesResponse.from(output));
    }

    @Override
    public CustomApiResponse<ParticipantVotesUpdateResponse> updateParticipantVotes(
            @PathVariable("session") final Tsid roomSession,
            @RequestBody final ParticipantVotesUpdateRequest request
    ) {
        final VotesOutput output = roomApplicationService.updateParticipantVotes(
                request.toInput(roomSession));
        return CustomApiResponse.ok("Update success",
                ParticipantVotesUpdateResponse.from(output));
    }

    @Override
    public CustomApiResponse<ParticipantCheckResponse> createParticipant(
            @PathVariable("session") final Tsid roomSession,
            @RequestBody final ParticipantCreateRequest request
    ) {
        final ParticipantCheckOutput output = roomApplicationService.createParticipant(
                request.toInput(roomSession));
        return CustomApiResponse.ok(ParticipantCheckResponse.from(output));
    }
}
