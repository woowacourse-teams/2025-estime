package com.bether.bether.room.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.bether.bether.common.NotFoundException;
import com.bether.bether.room.application.dto.RoomCreatedInput;
import com.bether.bether.room.application.dto.RoomCreatedOutput;
import com.bether.bether.room.application.dto.RoomOutput;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.assertj.core.api.SoftAssertions;
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
    void saveRoom() {
        // given
        final RoomCreatedInput input = new RoomCreatedInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(7, 0),
                LocalTime.of(20, 0),
                LocalDateTime.of(2026, 1, 1, 0, 0),
                true
        );

        // when
        final RoomCreatedOutput saved = roomService.saveRoom(input);

        // then
        assertThat(isValidUUID(saved.session().toString()))
                .isTrue();
    }

    @DisplayName("세션을 기반으로 방을 조회할 수 있다.")
    @Test
    void getRoomBySession() {
        // given
        final RoomCreatedInput input = new RoomCreatedInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(7, 0),
                LocalTime.of(20, 0),
                LocalDateTime.of(2026, 1, 1, 0, 0),
                true
        );
        final RoomCreatedOutput saved = roomService.saveRoom(input);

        // when
        final RoomOutput output = roomService.getBySession(saved.session());

        // then
        SoftAssertions.assertSoftly(softAssertions -> {
            softAssertions.assertThat(output.title())
                    .isEqualTo(input.title());
            softAssertions.assertThat(output.availableDates())
                    .containsExactlyInAnyOrderElementsOf(input.availableDates());
            softAssertions.assertThat(output.startTime())
                    .isEqualTo(input.startTime());
            softAssertions.assertThat(output.endTime())
                    .isEqualTo(input.endTime());
            softAssertions.assertThat(output.deadLine())
                    .isEqualTo(input.deadLine());
            softAssertions.assertThat(output.isPublic())
                    .isEqualTo(input.isPublic());
            softAssertions.assertThat(output.roomSession())
                    .isEqualTo(saved.session());
        });
    }

    @DisplayName("존재하지 않는 세션을 기반으로 방 조회 시 예외가 발생한다.")
    @Test
    void getRoomByNotExistedSession() {
        // given
        final UUID notExistedSession = UUID.fromString("1ac856c2-5236-4439-9f58-c4153a6ecb5d");

        // when // then
        assertThatThrownBy(() -> roomService.getBySession(notExistedSession))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Room not found");
    }

    @DisplayName("시작 시간의 분(minute)이 30분 단위가 아니면 예외가 발생한다.")
    @Test
    void saveWithInvalidStartTimeMinute() {
        // given
        final RoomCreatedInput input = new RoomCreatedInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(7, 15),
                LocalTime.of(20, 0),
                LocalDateTime.of(2026, 1, 1, 0, 0),
                true
        );

        // when // then
        assertThatThrownBy(() -> roomService.saveRoom(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("time must be in " + TIME_SLOT_MINUTES + "-minute intervals");
    }

    @DisplayName("종료 시간의 분(minute)이 30분 단위가 아니면 예외가 발생한다.")
    @Test
    void saveWithInvalidEndTimeMinute() {
        // given
        final RoomCreatedInput input = new RoomCreatedInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(7, 0),
                LocalTime.of(20, 45),
                LocalDateTime.of(2026, 1, 1, 0, 0),
                true
        );

        // when // then
        assertThatThrownBy(() -> roomService.saveRoom(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("time must be in " + TIME_SLOT_MINUTES + "-minute intervals");
    }

    @DisplayName("날짜 리스트가 비어있으면 예외가 발생한다.")
    @Test
    void saveWithEmptyDates() {
        // given
        final RoomCreatedInput input = new RoomCreatedInput(
                "title",
                List.of(),
                LocalTime.of(7, 0),
                LocalTime.of(20, 0),
                LocalDateTime.of(2026, 1, 1, 0, 0),
                true
        );

        // when // then
        assertThatThrownBy(() -> roomService.saveRoom(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("availableDates cannot be empty");
    }

    @DisplayName("오늘 이전의 날짜가 포함되어 있으면 예외가 발생한다.")
    @Test
    void saveWithPastDate() {
        // given
        final RoomCreatedInput input = new RoomCreatedInput(
                "title",
                List.of(LocalDate.now().minusDays(1)),
                LocalTime.of(7, 0),
                LocalTime.of(20, 0),
                LocalDateTime.of(2026, 1, 1, 0, 0),
                true
        );

        // when // then
        assertThatThrownBy(() -> roomService.saveRoom(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("availableDates cannot contain past dates: " + LocalDate.now().minusDays(1));
    }

    @DisplayName("시작 시간이 종료 시간보다 늦으면 예외가 발생한다.")
    @Test
    void saveWithStartTimeAfterEndTime() {
        // given
        final RoomCreatedInput input = new RoomCreatedInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(20, 0),
                LocalTime.of(7, 0),
                LocalDateTime.of(2026, 1, 1, 0, 0),
                true
        );

        // when // then
        assertThatThrownBy(() -> roomService.saveRoom(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("startTime cannot be after endTime");
    }

    @DisplayName("시작 시간이 종료 시간과 같으면 예외가 발생한다.")
    @Test
    void saveWithStartTimeEqualsEndTime() {
        // given
        final RoomCreatedInput input = new RoomCreatedInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(10, 30),
                LocalTime.of(10, 30),
                LocalDateTime.of(2026, 1, 1, 0, 0),
                true
        );

        // when // then
        assertThatThrownBy(() -> roomService.saveRoom(input))
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
