package com.bether.bether.timeslot.application.service;

import com.bether.bether.timeslot.application.dto.input.TimeSlotRankInput;
import com.bether.bether.timeslot.application.dto.output.TotalTimeSlotRankOutput;
import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TotalTimeSlotCount;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TimeSlotRankService {

    private final TimeSlotService timeSlotService;

    @Transactional(readOnly = true)
    public TotalTimeSlotRankOutput calculateRank(final TimeSlotRankInput input) {
        final List<TimeSlot> timeSlots = timeSlotService.getAllByRoomSession(input.roomSession());

        final TotalTimeSlotCount timeSlotCount = TotalTimeSlotCount.create();
        timeSlotCount.calculate(timeSlots);

        return TotalTimeSlotRankOutput.from(timeSlotCount);
    }
}
