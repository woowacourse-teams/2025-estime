package com.bether.bether.timeslot.application.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.bether.bether.timeslot.application.dto.input.TimeSlotRankInput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotRankOutput;
import com.bether.bether.timeslot.application.dto.output.TotalTimeSlotRankOutput;
import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlotRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class TimeSlotRankServiceTest {

    @Autowired
    private TimeSlotRankService timeSlotRankService;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @DisplayName("타임슬롯 랭킹을 계산한다.")
    @Test
    void calculateRank() {
        // given
        final UUID roomSession = UUID.randomUUID();
        final LocalDateTime dateTime1 = LocalDateTime.of(2024, 1, 1, 0, 0);
        final LocalDateTime dateTime2 = LocalDateTime.of(2024, 3, 1, 2, 30);

        timeSlotRepository.save(TimeSlot.withoutId(roomSession, "user", dateTime1));
        timeSlotRepository.save(TimeSlot.withoutId(roomSession, "user", dateTime2));
        timeSlotRepository.save(TimeSlot.withoutId(roomSession, "user2", dateTime1));

        final TimeSlotRankInput input = new TimeSlotRankInput(roomSession);

        // when
        final TotalTimeSlotRankOutput output = timeSlotRankService.calculateRank(input);

        // then
        assertThat(output.rank())
                .extracting(TimeSlotRankOutput::dateTime)
                .containsExactlyElementsOf(List.of(dateTime1, dateTime2));
    }

    @DisplayName("타임슬롯 리스트에 존재하지 않는 시간은 랭킹에 포함하지 않는다.")
    @Test
    void notContainNonExistedTimeSlot() {
        // given
        final UUID roomSession = UUID.randomUUID();
        final LocalDateTime dateTime1 = LocalDateTime.of(2024, 1, 1, 0, 0);
        final LocalDateTime notContainedDateTime = LocalDateTime.of(2024, 3, 1, 2, 30);

        timeSlotRepository.save(TimeSlot.withoutId(roomSession, "user", dateTime1));

        final TimeSlotRankInput input = new TimeSlotRankInput(roomSession);

        // when
        final TotalTimeSlotRankOutput output = timeSlotRankService.calculateRank(input);

        // then
        assertThat(output.rank())
                .extracting(TimeSlotRankOutput::dateTime)
                .doesNotContain(notContainedDateTime);
    }
}
