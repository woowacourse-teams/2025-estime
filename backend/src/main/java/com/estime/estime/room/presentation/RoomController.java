package com.estime.estime.room.presentation;

import com.estime.estime.common.CustomApiResponse;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotRecommendationsOutput;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.estime.datetimeslot.domain.DateTimeSlots;
import com.estime.estime.room.application.dto.RoomCreateOutput;
import com.estime.estime.room.application.dto.RoomOutput;
import com.estime.estime.room.application.service.RoomApplicationService;
import com.estime.estime.room.presentation.dto.request.RoomCreateRequest;
import com.estime.estime.room.presentation.dto.request.TimeSlotCreateRequest;
import com.estime.estime.room.presentation.dto.request.TimeSlotUpdateRequest;
import com.estime.estime.room.presentation.dto.request.UserCreateRequest;
import com.estime.estime.room.presentation.dto.response.RoomCreateResponse;
import com.estime.estime.room.presentation.dto.response.RoomResponse;
import com.estime.estime.room.presentation.dto.response.TimeSlotRecommendationsResponse;
import com.estime.estime.room.presentation.dto.response.TimeSlotStatisticResponse;
import com.estime.estime.room.presentation.dto.response.TotalDateTimeSlotUpdateResponse;
import com.estime.estime.room.presentation.dto.response.TotalTimeSlotResponse;
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
    public CustomApiResponse<TimeSlotStatisticResponse> generateTimeSlotStatistic(
            @PathVariable("session") final String session) {
        final DateTimeSlotStatisticOutput output = roomApplicationService.generateTimeSlotStatistic(session);
        return CustomApiResponse.ok(TimeSlotStatisticResponse.from(output));
    }

    @Override
    public CustomApiResponse<TimeSlotRecommendationsResponse> recommendTopTimeSlots(
            @PathVariable("session") final String session) {
        final DateTimeSlotRecommendationsOutput output = roomApplicationService.recommendTopTimeSlots(session);
        return CustomApiResponse.ok(TimeSlotRecommendationsResponse.from(output));
    }

    @Override
    public CustomApiResponse<Void> createTimeSlots(
            @PathVariable("session") final String session,
            @RequestBody final TimeSlotCreateRequest request
    ) {
        roomApplicationService.saveTimeSlots(request.toInput(session));
        return CustomApiResponse.ok();
    }

    @Override
    public CustomApiResponse<TotalTimeSlotResponse> getByUserName(
            @PathVariable("session") final String session,
            @RequestParam("name") final String userName
    ) {
        final DateTimeSlots dateTimeSlots = roomApplicationService.getTimeSlotsBySessionAndUserName(session, userName);
        return CustomApiResponse.ok(TotalTimeSlotResponse.from(dateTimeSlots));
    }

    @Override
    public CustomApiResponse<TotalDateTimeSlotUpdateResponse> updateTimeSlots(
            @PathVariable("session") final String session,
            @RequestBody final TimeSlotUpdateRequest request) {
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
