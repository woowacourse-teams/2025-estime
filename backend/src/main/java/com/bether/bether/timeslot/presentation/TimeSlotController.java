package com.bether.bether.timeslot.presentation;

import com.bether.bether.common.ApiResponse;
import com.bether.bether.timeslot.application.dto.input.TimeSlotRankInput;
import com.bether.bether.timeslot.application.dto.output.TotalTimeSlotRankOutput;
import com.bether.bether.timeslot.application.service.TimeSlotRankService;
import com.bether.bether.timeslot.application.service.TimeSlotService;
import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.presentation.dto.request.TimeSlotCreateRequest;
import com.bether.bether.timeslot.presentation.dto.response.TotalTimeSlotRankResponse;
import com.bether.bether.timeslot.presentation.dto.response.TotalTimeSlotResponse;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/time-slots")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;
    private final TimeSlotRankService timeSlotRankService;

    @GetMapping("/{room-session}")
    public ApiResponse<TotalTimeSlotResponse> get(@PathVariable("room-session") final String roomSession) {
        final List<TimeSlot> timeSlots = timeSlotService.getAllByRoomSession(UUID.fromString(roomSession));
        return ApiResponse.ok(TotalTimeSlotResponse.from(timeSlots));
    }

    @GetMapping("/{room-session}/rank")
    public ApiResponse<TotalTimeSlotRankResponse> getRank(@PathVariable("room-session") final String roomSession) {
        final TimeSlotRankInput input = TimeSlotRankInput.toInput(UUID.fromString(roomSession));
        final TotalTimeSlotRankOutput output = timeSlotRankService.calculateRank(input);
        return ApiResponse.ok(TotalTimeSlotRankResponse.from(output));
    }

    @PostMapping
    public ApiResponse<Void> create(@RequestBody final TimeSlotCreateRequest request) {
        final List<TimeSlot> timeSlots = timeSlotService.saveAll(request.toInput());
        return ApiResponse.ok();
    }
}
