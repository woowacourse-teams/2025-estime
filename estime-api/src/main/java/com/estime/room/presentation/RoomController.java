package com.estime.room.presentation;

import com.estime.common.CustomApiResponse;
import com.estime.room.application.dto.input.ParticipantVotesOutput;
import com.estime.room.application.dto.input.RoomSessionInput;
import com.estime.room.application.dto.input.VotesFindInput;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.application.dto.output.ParticipantCheckOutput;
import com.estime.room.application.dto.output.RoomCreateOutput;
import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.application.service.RoomApplicationService;
import com.estime.room.presentation.dto.request.ParticipantCreateRequest;
import com.estime.room.presentation.dto.request.ParticipantVotesUpdateRequest;
import com.estime.room.presentation.dto.request.RoomCreateRequest;
import com.estime.room.presentation.dto.response.DateTimeSlotStatisticResponse;
import com.estime.room.presentation.dto.response.ParticipantCheckResponse;
import com.estime.room.presentation.dto.response.ParticipantVotesResponse;
import com.estime.room.presentation.dto.response.ParticipantVotesUpdateResponse;
import com.estime.room.presentation.dto.response.RoomCreateResponse;
import com.estime.room.presentation.dto.response.RoomResponse;
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
    public CustomApiResponse<RoomResponse> getBySession(
            @PathVariable("session") final Tsid roomSession
    ) {
        final RoomOutput output = roomApplicationService.getRoomBySession(RoomSessionInput.from(roomSession));
        return CustomApiResponse.ok(RoomResponse.from(output));
    }

    @Override
    public CustomApiResponse<RoomCreateResponse> create(
            @RequestBody final RoomCreateRequest request
    ) {
        final RoomCreateOutput output = roomApplicationService.saveRoom(request.toInput());
        return CustomApiResponse.ok(RoomCreateResponse.from(output));
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
        final ParticipantVotesOutput output = roomApplicationService.getParticipantVotesBySessionAndParticipantName(
                VotesFindInput.of(roomSession, participantName));
        return CustomApiResponse.ok(ParticipantVotesResponse.from(output));
    }

    @Override
    public CustomApiResponse<ParticipantVotesUpdateResponse> updateParticipantVotes(
            @PathVariable("session") final Tsid roomSession,
            @RequestBody final ParticipantVotesUpdateRequest request
    ) {
        final ParticipantVotesOutput output = roomApplicationService.updateParticipantVotes(
                request.toInput(roomSession));
        return CustomApiResponse.ok("Update success",
                ParticipantVotesUpdateResponse.from(output));
    }

    @Override
    public CustomApiResponse<ParticipantCheckResponse> createParticipant(
            @PathVariable("session") final Tsid roomSession,
            @RequestBody final ParticipantCreateRequest request
    ) {
        final ParticipantCheckOutput output = roomApplicationService.saveParticipant(request.toInput(roomSession));
        return CustomApiResponse.ok(ParticipantCheckResponse.from(output));
    }
}
