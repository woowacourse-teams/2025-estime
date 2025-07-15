package com.bether.bether.room.presentation;

import com.bether.bether.common.ApiResponse;
import com.bether.bether.room.application.dto.RoomOutput;
import com.bether.bether.room.application.service.RoomService;
import com.bether.bether.room.presentation.dto.request.RoomCreateRequest;
import com.bether.bether.room.presentation.dto.response.RoomCreateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ApiResponse<RoomCreateResponse> create(@RequestBody final RoomCreateRequest request) {
        final RoomOutput saved = roomService.save(request.toInput());
        return ApiResponse.ok(RoomCreateResponse.from(saved));
    }

    @GetMapping("/{session}/time-slots/statistic")
    public ApiResponse<TimeSlotStatisticResponse> getStatistic(@PathVariable("session") final String session) {
        final TimeSlotStatisticOutput output = roomService.calculateStatistic(UUID.fromString(session));
        return ApiResponse.ok(TimeSlotStatisticResponse.from(output));
    }

    @GetMapping("/{session}/time-slots/recommendation")
    public ApiResponse<TimeSlotStatisticResponse> getRank(@PathVariable("session") final String session) {
        final TimeSlotStatisticOutput output = roomService.calculateStatistic(UUID.fromString(session));
        return ApiResponse.ok(TimeSlotStatisticResponse.from(output));
    }
}
