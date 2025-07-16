package com.bether.bether.room.presentation;

import com.bether.bether.common.ApiResponse;
import com.bether.bether.room.application.dto.RoomOutput;
import com.bether.bether.room.application.service.RoomService;
import com.bether.bether.room.presentation.dto.request.RoomCreateRequest;
import com.bether.bether.room.presentation.dto.request.TimeSlotCreateRequest;
import com.bether.bether.room.presentation.dto.response.RoomCreateResponse;
import com.bether.bether.room.presentation.dto.response.TimeSlotStatisticResponse;
import com.bether.bether.room.presentation.dto.response.TotalTimeSlotResponse;
import com.bether.bether.timeslot.application.dto.output.TimeSlotStatisticOutput;
import com.bether.bether.timeslot.domain.TimeSlot;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ApiResponse<RoomCreateResponse> create(@RequestBody final RoomCreateRequest request) {
        final RoomOutput saved = roomService.saveRoom(request.toInput());
        return ApiResponse.ok(RoomCreateResponse.from(saved));
    }

    @GetMapping("/{session}/time-slots/statistic")
    public ApiResponse<TimeSlotStatisticResponse> getStatistic(@PathVariable("session") final UUID session) {
        final TimeSlotStatisticOutput output = roomService.calculateStatistic(session);
        return ApiResponse.ok(TimeSlotStatisticResponse.from(output));
    }

    @GetMapping("/{session}/time-slots/recommendation")
    public ApiResponse<TimeSlotStatisticResponse> getRank(@PathVariable("session") final UUID session) {
        final TimeSlotStatisticOutput output = roomService.calculateStatistic(session);
        return ApiResponse.ok(TimeSlotStatisticResponse.from(output));
    }

    @PostMapping("/{session}/time-slots")
    public ApiResponse<Void> create(
            @PathVariable("session") final UUID session,
            @RequestBody final TimeSlotCreateRequest request
    ) {
        roomService.saveTimeSlots(request.toInput(session));
        return ApiResponse.ok();
    }

    @GetMapping("/{session}/time-slots/user")
    public ApiResponse<TotalTimeSlotResponse> getByUserName(
            @PathVariable("session") final UUID session,
            @RequestParam("name") final String userName
    ) {
        final List<TimeSlot> timeSlots = roomService.getTimeSlotsBySessionAndUserName(session, userName);
        return ApiResponse.ok(TotalTimeSlotResponse.from(timeSlots));
    }
}
