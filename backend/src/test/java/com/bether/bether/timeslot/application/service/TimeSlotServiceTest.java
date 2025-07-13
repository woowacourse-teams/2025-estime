package com.bether.bether.timeslot.application.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;
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
class TimeSlotServiceTest {

    @Autowired
    private TimeSlotService timeSlotService;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @DisplayName("룸 세션으로 타임슬롯을 가져올 수 있다.")
    @Test
    void getAllByRoomSession() {
        // given
        final UUID roomSession = UUID.randomUUID();
        final TimeSlot saved1 = timeSlotRepository.save(TimeSlot.withoutId(roomSession, "user", LocalDateTime.now()));
        final TimeSlot saved2 = timeSlotRepository.save(TimeSlot.withoutId(roomSession, "user", LocalDateTime.now()));

        // when
        final List<TimeSlot> found = timeSlotService.getAllByRoomSession(roomSession);

        // then
        assertThat(found)
                .containsExactlyElementsOf(List.of(saved1, saved2));
    }

    @DisplayName("존재하지 않는 룸 세션 조회시 빈 리스트를 반환한다.")
    @Test
    void getAllByNonExistingRoomSession() {
        // given
        final UUID roomSession = UUID.randomUUID();

        // when
        final List<TimeSlot> found = timeSlotService.getAllByRoomSession(roomSession);

        // then
        assertThat(found)
                .isEmpty();
    }

    @DisplayName("다수의 타임슬롯을 저장할 수 있다.")
    @Test
    void saveAll() {
        // given
        final TimeSlotInput input =
                new TimeSlotInput(
                        UUID.randomUUID(),
                        "user",
                        List.of(LocalDateTime.now(), LocalDateTime.now()));

        // when
        final List<TimeSlot> saved = timeSlotService.saveAll(input);

        // then
        assertThat(saved)
                .hasSize(2);
    }
}
