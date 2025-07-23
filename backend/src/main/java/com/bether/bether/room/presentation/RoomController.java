package com.bether.bether.room.presentation;

import com.bether.bether.common.CustomApiResponse;
import com.bether.bether.room.application.dto.RoomCreateOutput;
import com.bether.bether.room.application.dto.RoomOutput;
import com.bether.bether.room.application.service.RoomApplicationService;
import com.bether.bether.room.presentation.dto.request.RoomCreateRequest;
import com.bether.bether.room.presentation.dto.request.TimeSlotCreateRequest;
import com.bether.bether.room.presentation.dto.request.TimeSlotUpdateRequest;
import com.bether.bether.room.presentation.dto.request.UserCreateRequest;
import com.bether.bether.room.presentation.dto.response.RoomCreateResponse;
import com.bether.bether.room.presentation.dto.response.RoomResponse;
import com.bether.bether.room.presentation.dto.response.TimeSlotRecommendationsResponse;
import com.bether.bether.room.presentation.dto.response.TimeSlotStatisticResponse;
import com.bether.bether.room.presentation.dto.response.TotalTimeSlotResponse;
import com.bether.bether.room.presentation.dto.response.UserCreateResponse;
import com.bether.bether.timeslot.application.dto.output.TimeSlotRecommendationsOutput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotStatisticOutput;
import com.bether.bether.timeslot.domain.TimeSlots;
import com.bether.bether.user.application.dto.output.UserCreateOutput;
import java.util.UUID;
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
    public CustomApiResponse<RoomResponse> getBySession(@PathVariable("session") final UUID session) {
        final RoomOutput output = roomApplicationService.getBySession(session);
        return CustomApiResponse.ok(RoomResponse.from(output));
    }

    @Override
    public CustomApiResponse<TimeSlotStatisticResponse> generateTimeSlotStatistic(
            @PathVariable("session") final UUID session) {
        final TimeSlotStatisticOutput output = roomApplicationService.generateTimeSlotStatistic(session);
        return CustomApiResponse.ok(TimeSlotStatisticResponse.from(output));
    }

    @Override
    public CustomApiResponse<TimeSlotRecommendationsResponse> recommendTopTimeSlots(
            @PathVariable("session") final UUID session) {
        final TimeSlotRecommendationsOutput output = roomApplicationService.recommendTopTimeSlots(session);
        return CustomApiResponse.ok(TimeSlotRecommendationsResponse.from(output));
    }

    @Override
    public CustomApiResponse<Void> createTimeSlots(
            @PathVariable("session") final UUID session,
            @RequestBody final TimeSlotCreateRequest request
    ) {
        roomApplicationService.saveTimeSlots(request.toInput(session));
        return CustomApiResponse.ok();
    }

    @Override
    public CustomApiResponse<TotalTimeSlotResponse> getByUserName(
            @PathVariable("session") final UUID session,
            @RequestParam("name") final String userName
    ) {
        final TimeSlots timeSlots = roomApplicationService.getTimeSlotsBySessionAndUserName(session, userName);
        return CustomApiResponse.ok(TotalTimeSlotResponse.from(timeSlots));
    }

    @Override
    public CustomApiResponse<Void> updateTimeSlots(@PathVariable("session") final UUID session,
                                                   @RequestBody final TimeSlotUpdateRequest request) {
        roomApplicationService.updateTimeSlots(request.toInput(session));
        return CustomApiResponse.ok();
    }

    @Override
    public CustomApiResponse<UserCreateResponse> createUser(@PathVariable("session") final UUID session,
                                                            @RequestBody final UserCreateRequest request) {
        final UserCreateOutput output = roomApplicationService.saveUser(session, request.toInput(session));
        return CustomApiResponse.ok(UserCreateResponse.from(output));
    }
}
