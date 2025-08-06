package com.estime.room.presentation;

import com.estime.common.CustomApiResponse;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.application.dto.output.ParticipantCheckOutput;
import com.estime.room.application.dto.output.RoomCreateOutput;
import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.application.service.RoomApplicationService;
import com.estime.room.domain.participant.vote.Votes;
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
            @PathVariable("session") final Tsid session
    ) {
        final RoomOutput output = roomApplicationService.getRoomBySession(session);
        return CustomApiResponse.ok(RoomResponse.from(output));
    }

    @Override
    public CustomApiResponse<RoomCreateResponse> create(@RequestBody final RoomCreateRequest request) {
        final RoomCreateOutput saved = roomApplicationService.saveRoom(request.toInput());
        return CustomApiResponse.ok(RoomCreateResponse.from(saved));
    }

    @Override
    public CustomApiResponse<DateTimeSlotStatisticResponse> getDateTimeSlotStatisticBySession(
            @PathVariable("session") final Tsid session
    ) {
        final DateTimeSlotStatisticOutput output = roomApplicationService.calculateVoteStatistic(session);
        return CustomApiResponse.ok(DateTimeSlotStatisticResponse.from(output));
    }

    @Override
    public CustomApiResponse<ParticipantVotesResponse> getParticipantVotesBySessionAndParticipantName(
            @PathVariable("session") final Tsid session,
            @RequestParam("participantName") final String participantName
    ) {
        final Votes votes = roomApplicationService.getParticipantVotesBySessionAndParticipantName(session,
                participantName);
        return CustomApiResponse.ok(ParticipantVotesResponse.from(votes, participantName));
    }

    @Override
    public CustomApiResponse<ParticipantVotesUpdateResponse> updateParticipantVotes(
            @PathVariable("session") final Tsid session,
            @RequestBody final ParticipantVotesUpdateRequest request
    ) {
        final Votes slots = roomApplicationService.updateParticipantVotes(request.toInput(session));
        return CustomApiResponse.ok("Update success",
                ParticipantVotesUpdateResponse.of(slots, request.participantName()));
    }

    @Override
    public CustomApiResponse<ParticipantCheckResponse> createParticipant(
            @PathVariable("session") final Tsid session,
            @RequestBody final ParticipantCreateRequest request
    ) {
        final ParticipantCheckOutput output = roomApplicationService.saveParticipant(
                request.toInput(session));
        return CustomApiResponse.ok(ParticipantCheckResponse.from(output));
    }
}
