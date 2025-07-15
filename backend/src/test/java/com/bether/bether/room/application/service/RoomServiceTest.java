package com.bether.bether.room.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.bether.bether.room.application.dto.RoomInput;
import com.bether.bether.room.application.dto.RoomOutput;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class RoomServiceTest {

    private static final int TIME_SLOT_MINUTES = 30;

    @Autowired
    private RoomService roomService;

    @DisplayName("방을 생성할 수 있다.")
    @Test
    void save() {
        // given
        final RoomInput input = new RoomInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(7, 0),
                LocalTime.of(20, 0)
        );

        // when
        final RoomOutput saved = roomService.save(input);

        // then
        assertThat(isValidUUID(saved.session().toString()))
                .isTrue();
    }

    @DisplayName("시작 시간의 분(minute)이 30분 단위가 아니면 예외가 발생한다.")
    @Test
    void saveWithInvalidStartTimeMinute() {
        // given
        final RoomInput input = new RoomInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(7, 15),
                LocalTime.of(20, 0)
        );

        // when // then
        assertThatThrownBy(() -> roomService.save(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("time must be in " + TIME_SLOT_MINUTES + "-minute intervals");
    }

    @DisplayName("종료 시간의 분(minute)이 30분 단위가 아니면 예외가 발생한다.")
    @Test
    void saveWithInvalidEndTimeMinute() {
        // given
        final RoomInput input = new RoomInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(7, 0),
                LocalTime.of(20, 45)
        );

        // when // then
        assertThatThrownBy(() -> roomService.save(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("time must be in " + TIME_SLOT_MINUTES + "-minute intervals");
    }

    @DisplayName("날짜 리스트가 비어있으면 예외가 발생한다.")
    @Test
    void saveWithEmptyDates() {
        // given
        final RoomInput input = new RoomInput(
                "title",
                List.of(),
                LocalTime.of(7, 0),
                LocalTime.of(20, 0)
        );

        // when // then
        assertThatThrownBy(() -> roomService.save(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("availableDates cannot be empty");
    }

    @DisplayName("오늘 이전의 날짜가 포함되어 있으면 예외가 발생한다.")
    @Test
    void saveWithPastDate() {
        // given
        final RoomInput input = new RoomInput(
                "title",
                List.of(LocalDate.now().minusDays(1)),
                LocalTime.of(7, 0),
                LocalTime.of(20, 0)
        );

        // when // then
        assertThatThrownBy(() -> roomService.save(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("availableDates cannot contain past dates: " + LocalDate.now().minusDays(1));
    }

    @DisplayName("시작 시간이 종료 시간보다 늦으면 예외가 발생한다.")
    @Test
    void saveWithStartTimeAfterEndTime() {
        // given
        final RoomInput input = new RoomInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(20, 0),
                LocalTime.of(7, 0)
        );

        // when // then
        assertThatThrownBy(() -> roomService.save(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("startTime cannot be after endTime");
    }

    @DisplayName("시작 시간이 종료 시간과 같으면 예외가 발생한다.")
    @Test
    void saveWithStartTimeEqualsEndTime() {
        // given
        final RoomInput input = new RoomInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(10, 30),
                LocalTime.of(10, 30)
        );

        // when // then
        assertThatThrownBy(() -> roomService.save(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("startTime cannot be after endTime");
    }

    private boolean isValidUUID(final String uuid) {
        if (uuid == null || uuid.isEmpty()) {
            return false;
        }
        try {
            UUID.fromString(uuid);
            return true;
        } catch (final IllegalArgumentException e) {
            return false;
        }
    }
}
