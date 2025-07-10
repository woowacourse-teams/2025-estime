package com.bether.bether.timeslot.application.service;

import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlotRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class TimeSlotServiceTest {

    @Autowired
    private TimeSlotService timeSlotService;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @DisplayName("식별자로 타임슬롯을 가져올 수 있다")
    @Test
    void getById() {
        // given
        final TimeSlot saved = timeSlotRepository.save(TimeSlot.withoutId(LocalDateTime.now()));

        // when
        final TimeSlot found = timeSlotService.getById(saved.getId());

        // then
        assertThat(saved).isEqualTo(found);
    }
}
