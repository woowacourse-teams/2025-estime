package com.estime.room.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.common.NotFoundException;
import com.estime.room.application.dto.input.RoomCreateInput;
import com.estime.room.application.dto.output.RoomCreateOutput;
import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.domain.vo.DateSlot;
import com.estime.room.domain.vo.DateTimeSlot;
import com.estime.room.domain.vo.TimeSlot;
import com.github.f4b6a3.tsid.Tsid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class RoomApplicationServiceTest {

    @Autowired
    private RoomApplicationService roomApplicationService;

    @DisplayName("방을 생성할 수 있다.")
    @Test
    void saveRoom() {
        // given
        final RoomCreateInput input = new RoomCreateInput(
                "title",
                List.of(DateSlot.from(LocalDate.now())),
                List.of(TimeSlot.from(LocalTime.of(7, 0)), TimeSlot.from(LocalTime.of(20, 0))),
                DateTimeSlot.from(LocalDateTime.of(2026, 1, 1, 0, 0))
        );

        // when
        final RoomCreateOutput saved = roomApplicationService.saveRoom(input);

        // then
        assertThat(isValidTsid(saved.session()))
                .isTrue();
    }

    @DisplayName("세션을 기반으로 방을 조회할 수 있다.")
    @Test
    void getRoomBySession() {
        // given
        final RoomCreateInput input = new RoomCreateInput(
                "title",
                List.of(DateSlot.from(LocalDate.now())),
                List.of(TimeSlot.from(LocalTime.of(7, 0)), TimeSlot.from(LocalTime.of(20, 0))),
                DateTimeSlot.from(LocalDateTime.of(2026, 1, 1, 0, 0))
        );
        final RoomCreateOutput saved = roomApplicationService.saveRoom(input);

        // when
        final RoomOutput output = roomApplicationService.getRoomBySession(saved.session());

        // then
        assertSoftly(softAssertions -> {
            softAssertions.assertThat(output.title())
                    .isEqualTo(input.title());
            softAssertions.assertThat(output.availableDateSlots())
                    .containsExactlyInAnyOrderElementsOf(input.availableDateSlots());
            softAssertions.assertThat(output.availableTimeSlots())
                    .containsExactlyInAnyOrderElementsOf(input.availableTimeSlots());
            softAssertions.assertThat(output.deadline())
                    .isEqualTo(input.deadline());
            softAssertions.assertThat(output.roomSession())
                    .isEqualTo(saved.session());
        });
    }

    @DisplayName("존재하지 않는 세션을 기반으로 방 조회 시 예외가 발생한다.")
    @Test
    void getRoomByNonexistentSession() {
        // given
        final String nonexistentSession = "nonexistent-session";

        // when // then
        assertThatThrownBy(() -> roomApplicationService.getRoomBySession(nonexistentSession))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Room not found");
    }

    @DisplayName("DateSlot이 null이면 예외가 발생한다.")
    @Test
    void saveWithNullDateSlots() {
        // given
        final RoomCreateInput input = new RoomCreateInput(
                "title",
                null,
                List.of(TimeSlot.from(LocalTime.of(7, 0)), TimeSlot.from(LocalTime.of(20, 0))),
                DateTimeSlot.from(LocalDateTime.of(2026, 1, 1, 0, 0))
        );

        // when // then
        assertThatThrownBy(() -> roomApplicationService.saveRoom(input))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("availableDateSlots cannot be null");
    }

    @DisplayName("마감 시간이 과거이면 예외가 발생한다.")
    @Test
    void saveWithPastDeadline() {
        // given
        final RoomCreateInput input = new RoomCreateInput(
                "title",
                List.of(DateSlot.from(LocalDate.now())),
                List.of(TimeSlot.from(LocalTime.of(7, 0)), TimeSlot.from(LocalTime.of(20, 0))),
                DateTimeSlot.from(LocalDateTime.of(2000, 1, 1, 0, 0))
        );

        // when // then
        assertThatThrownBy(() -> roomApplicationService.saveRoom(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("deadline cannot be in the past");
    }

    private boolean isValidTsid(final String tsid) {
        if (tsid == null || tsid.isEmpty()) {
            return false;
        }
        return Tsid.isValid(tsid);
    }
}
