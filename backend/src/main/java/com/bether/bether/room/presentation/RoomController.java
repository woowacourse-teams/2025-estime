package com.bether.bether.room.presentation;

import com.bether.bether.common.CustomApiResponse;
import com.bether.bether.room.application.dto.RoomOutput;
import com.bether.bether.room.application.service.RoomService;
import com.bether.bether.room.presentation.dto.request.RoomCreateRequest;
import com.bether.bether.room.presentation.dto.request.TimeSlotCreateRequest;
import com.bether.bether.room.presentation.dto.response.RoomCreateResponse;
import com.bether.bether.room.presentation.dto.response.TimeSlotRecommendationsResponse;
import com.bether.bether.room.presentation.dto.response.TimeSlotStatisticResponse;
import com.bether.bether.room.presentation.dto.response.TotalTimeSlotResponse;
import com.bether.bether.timeslot.application.dto.output.TimeSlotRecommendationsOutput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotStatisticOutput;
import com.bether.bether.timeslot.domain.TimeSlot;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RoomController implements RoomControllerSpecification {

    private final RoomService roomService;

    @Override
    public CustomApiResponse<RoomCreateResponse> create(@RequestBody final RoomCreateRequest request) {
        final RoomOutput saved = roomService.saveRoom(request.toInput());
        return CustomApiResponse.created(RoomCreateResponse.from(saved));
    }

    @Override
    public CustomApiResponse<TimeSlotStatisticResponse> getStatistic(@PathVariable("session") final UUID session) {
        final TimeSlotStatisticOutput output = roomService.calculateStatistic(session);
        return CustomApiResponse.ok(TimeSlotStatisticResponse.from(output));
    }

    @Override
    public CustomApiResponse<TimeSlotRecommendationsResponse> getRecommendations(
            @PathVariable("session") final UUID session) {
        final TimeSlotRecommendationsOutput output = roomService.calculateRecommendation(session);
        return CustomApiResponse.ok(TimeSlotRecommendationsResponse.from(output));
    }

    @Override
    public CustomApiResponse<Void> createTimeSlots(
            @PathVariable("session") final UUID session,
            @RequestBody final TimeSlotCreateRequest request
    ) {
        roomService.saveTimeSlots(request.toInput(session));
        return CustomApiResponse.ok();
    }

    @Override
    public CustomApiResponse<TotalTimeSlotResponse> getByUserName(
            @PathVariable("session") final UUID session,
            @RequestParam("name") final String userName
    ) {
        final List<TimeSlot> timeSlots = roomService.getTimeSlotsBySessionAndUserName(session, userName);
        return CustomApiResponse.ok(TotalTimeSlotResponse.from(timeSlots));
    }
}
