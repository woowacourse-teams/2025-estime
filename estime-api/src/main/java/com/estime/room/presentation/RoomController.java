package com.estime.room.presentation;

import com.estime.common.CustomApiResponse;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.application.dto.output.ParticipantCreateOutput;
import com.estime.room.application.dto.output.RoomCreateOutput;
import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.application.service.RoomApplicationService;
import com.estime.room.domain.participant.vote.vo.Votes;
import com.estime.room.presentation.dto.request.ParticipantCreateRequest;
import com.estime.room.presentation.dto.request.VotesUpdateRequest;
import com.estime.room.presentation.dto.request.RoomCreateRequest;
import com.estime.room.presentation.dto.response.VoteStatisticResponse;
import com.estime.room.presentation.dto.response.ParticipantCreateResponse;
import com.estime.room.presentation.dto.response.RoomCreateResponse;
import com.estime.room.presentation.dto.response.RoomResponse;
import com.estime.room.presentation.dto.response.TotalDateTimeSlotResponse;
import com.estime.room.presentation.dto.response.TotalDateTimeSlotUpdateResponse;
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
    public CustomApiResponse<RoomResponse> getBySession(@PathVariable("session") final String session) {
        final RoomOutput output = roomApplicationService.getBySession(session);
        return CustomApiResponse.ok(RoomResponse.from(output));
    }

    @Override
    public CustomApiResponse<RoomCreateResponse> create(@RequestBody final RoomCreateRequest request) {
        final RoomCreateOutput saved = roomApplicationService.saveRoom(request.toInput());
        return CustomApiResponse.created(RoomCreateResponse.from(saved));
    }

    @Override
    public CustomApiResponse<VoteStatisticResponse> getVoteStatistic(
            @PathVariable("session") final String session
    ) {
        final DateTimeSlotStatisticOutput output = roomApplicationService.calculateVoteStatistic(session);
        return CustomApiResponse.ok(VoteStatisticResponse.from(output));
    }

    @Override
    public CustomApiResponse<TotalDateTimeSlotResponse> getDateTimeSlotsBySessionAndParticipantName(
            @PathVariable("session") final String session,
            @RequestParam("name") final String participantName
    ) {
        final Votes votes = roomApplicationService
                .getDateTimeSlotsBySessionAndParticipantName(session, participantName);
        return CustomApiResponse.ok(TotalDateTimeSlotResponse.from(votes));
    }

    @Override
    public CustomApiResponse<TotalDateTimeSlotUpdateResponse> updateDateTimeSlots(
            @PathVariable("session") final String session,
            @RequestBody final VotesUpdateRequest request
    ) {
        final Votes slots = roomApplicationService.updateDateTimeSlots(request.toInput(session));
        return CustomApiResponse.ok(TotalDateTimeSlotUpdateResponse.from(slots));
    }

    @Override
    public CustomApiResponse<ParticipantCreateResponse> createUser(
            @PathVariable("session") final String session,
            @RequestBody final ParticipantCreateRequest request
    ) {
        final ParticipantCreateOutput output = roomApplicationService.saveParticipant(session, request.toInput(session));
        return CustomApiResponse.ok(ParticipantCreateResponse.from(output));
    }
}
