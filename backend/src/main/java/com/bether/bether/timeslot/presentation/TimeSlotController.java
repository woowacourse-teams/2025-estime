package com.bether.bether.timeslot.presentation;

import com.bether.bether.common.ApiResponse;
import com.bether.bether.timeslot.application.service.TimeSlotService;
import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.presentation.dto.request.TimeSlotCreateRequest;
import com.bether.bether.timeslot.presentation.dto.response.TotalTimeSlotResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/time-slots")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @GetMapping("/{room-session}")
    public ApiResponse<TotalTimeSlotResponse> get(@PathVariable("room-session") final String roomSession) {
        final List<TimeSlot> timeSlots = timeSlotService.getAllByRoomSession(UUID.fromString(roomSession));
        return ApiResponse.ok(TotalTimeSlotResponse.from(timeSlots));
    }

    @GetMapping("/{room-session}/user")
    public ApiResponse<TotalTimeSlotResponse> getByUserName(
            @PathVariable("room-session") final String roomSession,
            @RequestParam("name") final String userName
    ) {
        final List<TimeSlot> timeSlots = timeSlotService.getAllByRoomSessionAndUserName(UUID.fromString(roomSession), userName);
        return ApiResponse.ok(TotalTimeSlotResponse.from(timeSlots));
    }

    @PostMapping
    public ApiResponse<Void> create(@RequestBody final TimeSlotCreateRequest request) {
        final List<TimeSlot> timeSlots = timeSlotService.saveAll(request.toInput());
        return ApiResponse.ok();
    }
}
