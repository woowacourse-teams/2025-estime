package com.bether.bether.timeslot.presentation;

import com.bether.bether.common.ApiResponse;
import com.bether.bether.timeslot.application.service.TimeSlotService;
import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.presentation.dto.request.TimeSlotCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/time-slot")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @PostMapping
    public ApiResponse<Void> create(@RequestBody final TimeSlotCreateRequest request) {
        final List<TimeSlot> timeSlots = timeSlotService.saveAll(request.toInput());
        return ApiResponse.ok();
    }
}
