package com.estime.estime.room.presentation;

import com.estime.estime.common.CustomApiResponse;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotRecommendationsOutput;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.estime.datetimeslot.domain.DateTimeSlots;
import com.estime.estime.room.application.dto.RoomCreateOutput;
import com.estime.estime.room.application.dto.RoomOutput;
import com.estime.estime.room.application.service.RoomApplicationService;
import com.estime.estime.room.presentation.dto.request.RoomCreateRequest;
import com.estime.estime.room.presentation.dto.request.DateTimeSlotCreateRequest;
import com.estime.estime.room.presentation.dto.request.DateTimeSlotUpdateRequest;
import com.estime.estime.room.presentation.dto.request.UserCreateRequest;
import com.estime.estime.room.presentation.dto.response.RoomCreateResponse;
import com.estime.estime.room.presentation.dto.response.RoomResponse;
import com.estime.estime.room.presentation.dto.response.DateTimeSlotRecommendationsResponse;
import com.estime.estime.room.presentation.dto.response.DateTimeSlotStatisticResponse;
import com.estime.estime.room.presentation.dto.response.TotalDateTimeSlotUpdateResponse;
import com.estime.estime.room.presentation.dto.response.TotalDateTimeSlotResponse;
import com.estime.estime.room.presentation.dto.response.UserCreateResponse;
import com.estime.estime.user.application.dto.output.UserCreateOutput;
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
    public CustomApiResponse<RoomCreateResponse> create(@RequestBody final RoomCreateRequest request) {
        final RoomCreateOutput saved = roomApplicationService.saveRoom(request.toInput());
        return CustomApiResponse.created(RoomCreateResponse.from(saved));
    }

    @Override
    public CustomApiResponse<RoomResponse> getBySession(@PathVariable("session") final String session) {
        final RoomOutput output = roomApplicationService.getBySession(session);
        return CustomApiResponse.ok(RoomResponse.from(output));
    }

    @Override
    public CustomApiResponse<DateTimeSlotStatisticResponse> generateDateTimeSlotStatistic(
            @PathVariable("session") final String session) {
        final DateTimeSlotStatisticOutput output = roomApplicationService.generateDateTimeSlotStatistic(session);
        return CustomApiResponse.ok(DateTimeSlotStatisticResponse.from(output));
    }

    @Override
    public CustomApiResponse<DateTimeSlotRecommendationsResponse> recommendTopDateTimeSlots(
            @PathVariable("session") final String session) {
        final DateTimeSlotRecommendationsOutput output = roomApplicationService.recommendTopDateTimeSlots(session);
        return CustomApiResponse.ok(DateTimeSlotRecommendationsResponse.from(output));
    }

    @Override
    public CustomApiResponse<Void> createDateTimeSlots(
            @PathVariable("session") final String session,
            @RequestBody final DateTimeSlotCreateRequest request
    ) {
        roomApplicationService.saveDateTimeSlots(request.toInput(session));
        return CustomApiResponse.ok();
    }

    @Override
    public CustomApiResponse<TotalDateTimeSlotResponse> getByUserName(
            @PathVariable("session") final String session,
            @RequestParam("name") final String userName
    ) {
        final DateTimeSlots dateTimeSlots = roomApplicationService.getDateTimeSlotsBySessionAndUserName(session, userName);
        return CustomApiResponse.ok(TotalDateTimeSlotResponse.from(dateTimeSlots));
    }

    @Override
    public CustomApiResponse<TotalDateTimeSlotUpdateResponse> updateDateTimeSlots(
            @PathVariable("session") final String session,
            @RequestBody final DateTimeSlotUpdateRequest request) {
        final DateTimeSlots dateTimeSlots = roomApplicationService.updateTimeSlots(request.toInput(session));
        return CustomApiResponse.ok(TotalDateTimeSlotUpdateResponse.from(dateTimeSlots));
    }

    @Override
    public CustomApiResponse<UserCreateResponse> createUser(@PathVariable("session") final String session,
                                                            @RequestBody final UserCreateRequest request) {
        final UserCreateOutput output = roomApplicationService.saveUser(session, request.toInput(session));
        return CustomApiResponse.ok(UserCreateResponse.from(output));
    }
}
